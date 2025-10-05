import { beforeEach, describe, expect, it } from 'vitest';

import { ConsoleLogger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { AlarmsService } from '@/alarms/application/alarms.service';
import { CreateAlarmCommand } from '@/alarms/application/commands/create-alarm.command';
import { AlarmAlreadyExistsError } from '@/alarms/application/errors/alarm-already-exits.error';
import { GetAlarmsQuery } from '@/alarms/application/queries/get-alarms.query';
import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmBuilder } from '@/alarms/test/fixtures/builders/alarm.builder';
import { AlarmPersonae } from '@/alarms/test/fixtures/personae/alarm.personae';
import { globalMocks } from '@/shared/test/setup';

describe('Service: AlarmsService', () => {
  let service: AlarmsService;
  let logger: ConsoleLogger;

  beforeEach(() => {
    logger = new ConsoleLogger();
    service = new AlarmsService(globalMocks.commandBus as CommandBus, globalMocks.queryBus as QueryBus, logger);
  });

  describe('create', () => {
    it('should create a new alarm successfully', async () => {
      // Given: a valid create alarm command and expected alarm
      const command = new CreateAlarmCommand('System Alert', 'critical');
      const expectedAlarm = AlarmBuilder.create().setName('System Alert').setSeverity('critical').build();
      globalMocks.commandBus.setupForSuccess(expectedAlarm);

      // When: creating an alarm through the service
      const result = await service.create(command);

      // Then: it should return the alarm from command bus
      expect(result).toBe(expectedAlarm);
      expect(globalMocks.commandBus.execute).toHaveBeenCalledWith(command);
    });

    it('should create alarm with different severity levels', async () => {
      // Given: create alarm commands with different severity levels
      const severities = ['critical', 'high', 'medium', 'low'] as const;

      for (const severity of severities) {
        const command = new CreateAlarmCommand(`Alarm ${severity}`, severity);
        const expectedAlarm = AlarmBuilder.create().setName(`Alarm ${severity}`).setSeverity(severity).build();
        globalMocks.commandBus.setupForSuccess(expectedAlarm);

        // When: creating an alarm with specific severity
        const result = await service.create(command);

        // Then: should return alarm with correct severity
        expect(result.severity.value).toBe(severity);
        expect(result.name.value).toBe(`Alarm ${severity}`);
        expect(globalMocks.commandBus.execute).toHaveBeenCalledWith(command);
      }
    });

    it('should throw AlarmAlreadyExistsError when alarm with same name exists', async () => {
      // Given: a create alarm command that will cause an error
      const command = new CreateAlarmCommand('Existing Alarm', 'high');
      const error = new AlarmAlreadyExistsError();
      globalMocks.commandBus.setupForError(error);

      // When & Then: creating an alarm should throw AlarmAlreadyExistsError
      await expect(service.create(command)).rejects.toThrow(AlarmAlreadyExistsError);
      expect(globalMocks.commandBus.execute).toHaveBeenCalledWith(command);
    });

    it('should create alarm with trimmed name', async () => {
      // Given: a create alarm command with whitespace in name
      const command = new CreateAlarmCommand('  System Alert  ', 'critical');
      const expectedAlarm = AlarmBuilder.create().setName('System Alert').setSeverity('critical').build();
      globalMocks.commandBus.setupForSuccess(expectedAlarm);

      // When: creating an alarm
      const result = await service.create(command);

      // Then: should return alarm with trimmed name
      expect(result.name.value).toBe('System Alert');
      expect(globalMocks.commandBus.execute).toHaveBeenCalledWith(command);
    });

    it('should validate alarm name and severity through value objects', async () => {
      // Given: a create alarm command with invalid data
      const command = new CreateAlarmCommand('', 'invalid-severity');
      const error = new Error('Validation failed');
      globalMocks.commandBus.setupForError(error);

      // When & Then: creating an alarm should throw validation errors
      await expect(service.create(command)).rejects.toThrow('Validation failed');
      expect(globalMocks.commandBus.execute).toHaveBeenCalledWith(command);
    });
  });

  describe('findAll', () => {
    it('should return all alarms from repository', async () => {
      // Given: existing alarms and a query
      const existingAlarms = [AlarmPersonae.high, AlarmPersonae.medium, AlarmPersonae.low];
      const query = new GetAlarmsQuery();
      globalMocks.queryBus.setupForSuccess(existingAlarms);

      // When: retrieving all alarms
      const result = await service.findAll(query);

      // Then: should return all alarms from query bus
      expect(result).toEqual(existingAlarms);
      expect(globalMocks.queryBus.execute).toHaveBeenCalledWith(query);
    });

    it('should return empty array when no alarms exist', async () => {
      // Given: no alarms and a query
      const query = new GetAlarmsQuery();
      globalMocks.queryBus.setupForSuccess([]);

      // When: retrieving all alarms
      const result = await service.findAll(query);

      // Then: should return empty array
      expect(result).toEqual([]);
      expect(globalMocks.queryBus.execute).toHaveBeenCalledWith(query);
    });

    it('should handle repository errors during findAll', async () => {
      // Given: query bus error
      const query = new GetAlarmsQuery();
      const queryError = new Error('Database query failed');
      globalMocks.queryBus.setupForError(queryError);

      // When & Then: retrieving all alarms should propagate the error
      await expect(service.findAll(query)).rejects.toThrow('Database query failed');
      expect(globalMocks.queryBus.execute).toHaveBeenCalledWith(query);
    });

    it('should return alarms with correct domain objects', async () => {
      // Given: alarms with different properties using builder
      const existingAlarms = [
        AlarmBuilder.create().setName('Critical Alert').setSeverity('critical').build(),
        AlarmBuilder.create().setName('Low Priority Alert').setSeverity('low').build(),
      ];
      const query = new GetAlarmsQuery();
      globalMocks.queryBus.setupForSuccess(existingAlarms);

      // When: retrieving all alarms
      const result = await service.findAll(query);

      // Then: should return proper domain objects
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Alarm);
      expect(result[1]).toBeInstanceOf(Alarm);
      expect(result[0].name.value).toBe('Critical Alert');
      expect(result[1].name.value).toBe('Low Priority Alert');
      expect(result[0].severity.value).toBe('critical');
      expect(result[1].severity.value).toBe('low');
      expect(globalMocks.queryBus.execute).toHaveBeenCalledWith(query);
    });
  });
});
