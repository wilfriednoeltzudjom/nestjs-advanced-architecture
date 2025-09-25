import { beforeEach, describe, expect, it } from 'vitest';

import { ConsoleLogger } from '@nestjs/common';

import { AlarmsService } from '@/alarms/application/alarms.service';
import { CreateAlarmCommand } from '@/alarms/application/commands/create-alarm.command';
import { AlarmAlreadyExistsError } from '@/alarms/application/errors/alarm-already-exits.error';
import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmFactory } from '@/alarms/domain/factories/alarm.factory';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmBuilder } from '@/alarms/test/fixtures/builders/alarm.builder';
import { AlarmPersonae } from '@/alarms/test/fixtures/personae/alarm.personae';
import { MockAlarmRepository } from '@/alarms/test/mocks/alarm.repository.mock';
import { globalMocks } from '@/shared/test/setup';

describe('Service: AlarmsService', () => {
  let service: AlarmsService;
  let alarmRepository: MockAlarmRepository;
  let alarmFactory: AlarmFactory;

  beforeEach(() => {
    globalMocks.idProvider.resetDefaults();
    alarmRepository = new MockAlarmRepository();
    alarmFactory = new AlarmFactory(globalMocks.idProvider);
    service = new AlarmsService(alarmRepository, alarmFactory, new ConsoleLogger());
  });

  describe('create', () => {
    it('should create a new alarm successfully', async () => {
      // Given: a valid create alarm command and no existing alarm
      const command = new CreateAlarmCommand('System Alert', 'critical');
      alarmRepository.findByName.mockResolvedValue(null);
      alarmRepository.create.mockResolvedValue(undefined);

      // When: creating an alarm
      await service.create(command);

      // Then: should check for existing alarm and create new one
      expect(alarmRepository.findByName).toHaveBeenCalledWith(AlarmName.from('System Alert'));
      expect(alarmRepository.create).toHaveBeenCalledTimes(1);

      const createdAlarm = alarmRepository.create.mock.calls[0][0];
      expect(createdAlarm).toBeInstanceOf(Alarm);
      expect(createdAlarm.name.value).toBe('System Alert');
      expect(createdAlarm.severity.value).toBe('critical');
    });

    it('should create alarm with different severity levels', async () => {
      // Given: create alarm commands with different severity levels using personae
      const severities = ['critical', 'high', 'medium', 'low'] as const;
      alarmRepository.findByName.mockResolvedValue(null);
      alarmRepository.create.mockResolvedValue(undefined);

      for (const severity of severities) {
        const command = new CreateAlarmCommand(`Alarm ${severity}`, severity);

        // When: creating an alarm with specific severity
        await service.create(command);

        // Then: should create alarm with correct severity
        const createdAlarm = alarmRepository.create.mock.calls[alarmRepository.create.mock.calls.length - 1][0];
        expect(createdAlarm.severity.value).toBe(severity);
        expect(createdAlarm.name.value).toBe(`Alarm ${severity}`);
      }
    });

    it('should throw AlarmAlreadyExistsError when alarm with same name exists', async () => {
      // Given: a create alarm command and an existing alarm with the same name using personae
      const command = new CreateAlarmCommand('Existing Alarm', 'high');
      const existingAlarm = AlarmPersonae.high;
      alarmRepository.findByName.mockResolvedValue(existingAlarm);

      // When & Then: creating an alarm should throw AlarmAlreadyExistsError
      await expect(service.create(command)).rejects.toThrow(AlarmAlreadyExistsError);
      expect(alarmRepository.findByName).toHaveBeenCalledWith(AlarmName.from('Existing Alarm'));
      expect(alarmRepository.create).not.toHaveBeenCalled();
    });

    it('should create alarm with trimmed name', async () => {
      // Given: a create alarm command with whitespace in name
      const command = new CreateAlarmCommand('  System Alert  ', 'critical');
      alarmRepository.findByName.mockResolvedValue(null);
      alarmRepository.create.mockResolvedValue(undefined);

      // When: creating an alarm
      await service.create(command);

      // Then: should create alarm with trimmed name
      const createdAlarm = alarmRepository.create.mock.calls[0][0];
      expect(createdAlarm.name.value).toBe('System Alert');
    });

    it('should validate alarm name and severity through value objects', async () => {
      // Given: a create alarm command with invalid data
      const command = new CreateAlarmCommand('', 'invalid-severity');
      alarmRepository.findByName.mockResolvedValue(null);

      // When & Then: creating an alarm should throw validation errors
      await expect(service.create(command)).rejects.toThrow();
      expect(alarmRepository.findByName).not.toHaveBeenCalled();
      expect(alarmRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all alarms from repository', async () => {
      // Given: existing alarms in repository using personae
      const existingAlarms = [AlarmPersonae.high, AlarmPersonae.medium, AlarmPersonae.low];
      alarmRepository.findAll.mockResolvedValue(existingAlarms);

      // When: retrieving all alarms
      const result = await service.findAll();

      // Then: should return all alarms from repository
      expect(result).toEqual(existingAlarms);
      expect(alarmRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no alarms exist', async () => {
      // Given: no alarms in repository
      alarmRepository.findAll.mockResolvedValue([]);

      // When: retrieving all alarms
      const result = await service.findAll();

      // Then: should return empty array
      expect(result).toEqual([]);
      expect(alarmRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors during findAll', async () => {
      // Given: repository error
      const repositoryError = new Error('Database query failed');
      alarmRepository.findAll.mockRejectedValue(repositoryError);

      // When & Then: retrieving all alarms should propagate the error
      await expect(service.findAll()).rejects.toThrow('Database query failed');
      expect(alarmRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return alarms with correct domain objects', async () => {
      // Given: alarms with different properties using builder
      const existingAlarms = [
        AlarmBuilder.create().setName('Critical Alert').setSeverity('critical').build(),
        AlarmBuilder.create().setName('Low Priority Alert').setSeverity('low').build(),
      ];
      alarmRepository.findAll.mockResolvedValue(existingAlarms);

      // When: retrieving all alarms
      const result = await service.findAll();

      // Then: should return proper domain objects
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Alarm);
      expect(result[1]).toBeInstanceOf(Alarm);
      expect(result[0].name.value).toBe('Critical Alert');
      expect(result[1].name.value).toBe('Low Priority Alert');
      expect(result[0].severity.value).toBe('critical');
      expect(result[1].severity.value).toBe('low');
    });
  });
});
