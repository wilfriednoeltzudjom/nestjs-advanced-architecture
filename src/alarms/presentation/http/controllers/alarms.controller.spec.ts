import { beforeEach, describe, expect, it } from 'vitest';

import { CreateAlarmCommand } from '@/alarms/application/commands/create-alarm.command';
import { AlarmAlreadyExistsError } from '@/alarms/application/errors/alarm-already-exits.error';
import { AlarmsController } from '@/alarms/presentation/http/controllers/alarms.controller';
import { CreateAlarmDto } from '@/alarms/presentation/http/dto/create-alarm.dto';
import { AlarmBuilder } from '@/alarms/test/fixtures/builders/alarm.builder';
import { AlarmPersonae } from '@/alarms/test/fixtures/personae/alarm.personae';
import { MockAlarmsService } from '@/alarms/test/mocks/alarms.service.mock';
import { globalMocks } from '@/shared/test/setup';

describe('Controller: AlarmsController', () => {
  let controller: AlarmsController;
  let alarmsService: MockAlarmsService;

  beforeEach(() => {
    globalMocks.idProvider.resetDefaults();
    alarmsService = new MockAlarmsService();
    controller = new AlarmsController(alarmsService);
  });

  describe('create', () => {
    it('should create a new alarm successfully', async () => {
      // Given: a valid create alarm DTO and mock alarm entity
      const createAlarmDto: CreateAlarmDto = {
        name: 'System Alert',
        severity: 'critical',
      };
      const mockAlarm = AlarmBuilder.create().setName('System Alert').setSeverity('critical').build();
      alarmsService.create.mockResolvedValue(mockAlarm);

      // When: creating an alarm through the controller
      const result = await controller.create(createAlarmDto);

      // Then: should call the service with correct command and return primitives
      expect(alarmsService.create).toHaveBeenCalledTimes(1);
      const calledCommand = alarmsService.create.mock.calls[0][0];
      expect(calledCommand).toBeInstanceOf(CreateAlarmCommand);
      expect(calledCommand.name).toBe('System Alert');
      expect(calledCommand.severity).toBe('critical');
      expect(result).toEqual(mockAlarm.toPrimitives());
    });

    it('should create alarm with different severity levels', async () => {
      // Given: create alarm DTOs with different severity levels
      const severities = ['critical', 'high', 'medium', 'low'] as const;

      for (const severity of severities) {
        const createAlarmDto: CreateAlarmDto = {
          name: `Test Alarm ${severity}`,
          severity,
        };
        const mockAlarm = AlarmBuilder.create().setName(`Test Alarm ${severity}`).setSeverity(severity).build();
        alarmsService.create.mockResolvedValue(mockAlarm);

        // When: creating an alarm with specific severity
        const result = await controller.create(createAlarmDto);

        // Then: should call service with correct command and return primitives
        const calledCommand = alarmsService.create.mock.calls[alarmsService.create.mock.calls.length - 1][0];
        expect(calledCommand.name).toBe(`Test Alarm ${severity}`);
        expect(calledCommand.severity).toBe(severity);
        expect(result).toEqual(mockAlarm.toPrimitives());
      }
    });

    it('should handle alarm creation with whitespace in name', async () => {
      // Given: a create alarm DTO with whitespace in name
      const createAlarmDto: CreateAlarmDto = {
        name: '  System Alert  ',
        severity: 'high',
      };
      const mockAlarm = AlarmBuilder.create().setName('  System Alert  ').setSeverity('high').build();
      alarmsService.create.mockResolvedValue(mockAlarm);

      // When: creating an alarm through the controller
      const result = await controller.create(createAlarmDto);

      // Then: should pass the raw data to service (trimming happens in domain) and return primitives
      const calledCommand = alarmsService.create.mock.calls[0][0];
      expect(calledCommand.name).toBe('  System Alert  ');
      expect(calledCommand.severity).toBe('high');
      expect(result).toEqual(mockAlarm.toPrimitives());
    });

    it('should propagate AlarmAlreadyExistsError from service', async () => {
      // Given: a create alarm DTO and service throws AlarmAlreadyExistsError
      const createAlarmDto: CreateAlarmDto = {
        name: 'Existing Alarm',
        severity: 'medium',
      };
      const alreadyExistsError = new AlarmAlreadyExistsError();
      alarmsService.create.mockRejectedValue(alreadyExistsError);

      // When & Then: creating an alarm should propagate the error
      await expect(controller.create(createAlarmDto)).rejects.toThrow(AlarmAlreadyExistsError);
      expect(alarmsService.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate validation errors from service', async () => {
      // Given: a create alarm DTO with invalid data and service throws validation error
      const createAlarmDto: CreateAlarmDto = {
        name: '',
        severity: 'invalid-severity',
      };
      const validationError = new Error('Validation failed');
      alarmsService.create.mockRejectedValue(validationError);

      // When & Then: creating an alarm should propagate the error
      await expect(controller.create(createAlarmDto)).rejects.toThrow('Validation failed');
      expect(alarmsService.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors from service', async () => {
      // Given: a create alarm DTO and service throws repository error
      const createAlarmDto: CreateAlarmDto = {
        name: 'Test Alarm',
        severity: 'low',
      };
      const repositoryError = new Error('Database connection failed');
      alarmsService.create.mockRejectedValue(repositoryError);

      // When & Then: creating an alarm should propagate the error
      await expect(controller.create(createAlarmDto)).rejects.toThrow('Database connection failed');
      expect(alarmsService.create).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple alarm creation requests', async () => {
      // Given: multiple create alarm DTOs
      const createAlarmDtos: CreateAlarmDto[] = [
        { name: 'First Alarm', severity: 'critical' },
        { name: 'Second Alarm', severity: 'high' },
        { name: 'Third Alarm', severity: 'medium' },
      ];

      // When: creating multiple alarms
      for (const dto of createAlarmDtos) {
        const mockAlarm = AlarmBuilder.create().setName(dto.name).setSeverity(dto.severity).build();
        alarmsService.create.mockResolvedValue(mockAlarm);
        const result = await controller.create(dto);
        expect(result).toEqual(mockAlarm.toPrimitives());
      }

      // Then: should call service for each alarm
      expect(alarmsService.create).toHaveBeenCalledTimes(3);

      // Verify each command was created correctly
      const calledCommands = alarmsService.create.mock.calls.map((call) => call[0] as CreateAlarmCommand);
      expect(calledCommands[0].name).toBe('First Alarm');
      expect(calledCommands[1].name).toBe('Second Alarm');
      expect(calledCommands[2].name).toBe('Third Alarm');
    });
  });

  describe('findAll', () => {
    it('should return all alarms from service', async () => {
      // Given: existing alarms in service using personae
      const existingAlarms = [AlarmPersonae.high, AlarmPersonae.medium, AlarmPersonae.low];
      alarmsService.findAll.mockResolvedValue(existingAlarms);

      // When: retrieving all alarms through the controller
      const result = await controller.findAll();

      // Then: should return primitives of all alarms from service
      expect(result).toEqual(existingAlarms.map((alarm) => alarm.toPrimitives()));
      expect(alarmsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no alarms exist', async () => {
      // Given: no alarms in service
      alarmsService.findAll.mockResolvedValue([]);

      // When: retrieving all alarms through the controller
      const result = await controller.findAll();

      // Then: should return empty array
      expect(result).toEqual([]);
      expect(alarmsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return alarms with correct primitives', async () => {
      // Given: alarms with different properties using builder
      const existingAlarms = [
        AlarmBuilder.create().setName('Critical Alert').setSeverity('critical').build(),
        AlarmBuilder.create().setName('Low Priority Alert').setSeverity('low').build(),
      ];
      alarmsService.findAll.mockResolvedValue(existingAlarms);

      // When: retrieving all alarms through the controller
      const result = await controller.findAll();

      // Then: should return proper primitives
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: existingAlarms[0].id.value,
        name: 'Critical Alert',
        severity: 'critical',
        triggeredAt: existingAlarms[0].triggeredAt,
        isAcknowledged: existingAlarms[0].isAcknowledged,
        entries: existingAlarms[0].entries.map((entry) => entry.toPrimitives()),
        createdAt: existingAlarms[0].createdAt,
        updatedAt: existingAlarms[0].updatedAt,
      });
      expect(result[1]).toEqual({
        id: existingAlarms[1].id.value,
        name: 'Low Priority Alert',
        severity: 'low',
        triggeredAt: existingAlarms[1].triggeredAt,
        isAcknowledged: existingAlarms[1].isAcknowledged,
        entries: existingAlarms[1].entries.map((entry) => entry.toPrimitives()),
        createdAt: existingAlarms[1].createdAt,
        updatedAt: existingAlarms[1].updatedAt,
      });
    });

    it('should propagate service errors during findAll', async () => {
      // Given: service throws an error
      const serviceError = new Error('Service unavailable');
      alarmsService.findAll.mockRejectedValue(serviceError);

      // When & Then: retrieving all alarms should propagate the error
      await expect(controller.findAll()).rejects.toThrow('Service unavailable');
      expect(alarmsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors from service', async () => {
      // Given: service throws repository error
      const repositoryError = new Error('Database query failed');
      alarmsService.findAll.mockRejectedValue(repositoryError);

      // When & Then: retrieving all alarms should propagate the error
      await expect(controller.findAll()).rejects.toThrow('Database query failed');
      expect(alarmsService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
