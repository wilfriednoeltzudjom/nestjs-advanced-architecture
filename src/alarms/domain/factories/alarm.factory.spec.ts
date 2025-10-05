import { beforeEach, describe, expect, it } from 'vitest';

import { AlarmEntry } from '@/alarms/domain/entities/alarm-entry.entity';
import { AlarmFactory } from '@/alarms/domain/factories/alarm.factory';
import { AlarmEntryId } from '@/alarms/domain/value-objects/alarm-entry-id.vo';
import { AlarmEntryName } from '@/alarms/domain/value-objects/alarm-entry-name.vo';
import { AlarmEntryType } from '@/alarms/domain/value-objects/alarm-entry-type.vo';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity.vo';
import { commonFixtures, globalMocks } from '@/shared/test/setup';

describe('Factory: AlarmFactory', () => {
  let alarmFactory: AlarmFactory;

  beforeEach(() => {
    globalMocks.idProvider.resetDefaults();
    alarmFactory = new AlarmFactory(globalMocks.idProvider);
  });

  describe('create', () => {
    it('should create an alarm with generated ID and timestamps', () => {
      // Given: valid alarm properties without ID and timestamps
      const name = AlarmName.from('System Alert');
      const severity = AlarmSeverity.from('critical');

      // When: creating an alarm using the factory
      const alarm = alarmFactory.create({ name, severity });

      // Then: it should create a valid alarm with generated ID and timestamps
      expect(alarm).toBeDefined();
      expect(alarm.id.value).toBeDefined();
      expect(typeof alarm.id.value).toBe('string');
      expect(alarm.name).toBe(name);
      expect(alarm.severity).toBe(severity);
      expect(alarm.triggeredAt).toBeInstanceOf(Date);
      expect(alarm.isAcknowledged).toBe(false);
      expect(alarm.entries).toEqual([]);
      expect(alarm.createdAt).toBeInstanceOf(Date);
      expect(alarm.updatedAt).toBeInstanceOf(Date);
      expect(alarm.createdAt).toEqual(alarm.updatedAt);
      expect(globalMocks.idProvider.generate).toHaveBeenCalledTimes(1);
    });

    it('should create alarms with different severity levels', () => {
      // Given: alarm properties with different severity levels
      const severities = ['critical', 'high', 'medium', 'low'] as const;
      const name = AlarmName.from('Test Alarm');

      severities.forEach((severityValue) => {
        const severity = AlarmSeverity.from(severityValue);

        // When: creating an alarm with the specific severity
        const alarm = alarmFactory.create({ name, severity });

        // Then: it should create a valid alarm with the correct severity
        expect(alarm.severity.value).toBe(severityValue);
        expect(alarm.name).toBe(name);
        expect(alarm.createdAt).toBeInstanceOf(Date);
        expect(alarm.updatedAt).toBeInstanceOf(Date);
      });
    });

    it('should generate unique IDs for multiple alarms', () => {
      // Given: multiple alarm creation requests with unique ID generation
      const name = AlarmName.from('Test Alarm');
      const severity = AlarmSeverity.from('medium');

      // Setup mock to return different IDs for each call
      globalMocks.idProvider.generate
        .mockReturnValueOnce('id-1')
        .mockReturnValueOnce('id-2')
        .mockReturnValueOnce('id-3');

      // When: creating multiple alarms
      const alarm1 = alarmFactory.create({ name, severity });
      const alarm2 = alarmFactory.create({ name, severity });
      const alarm3 = alarmFactory.create({ name, severity });

      // Then: each alarm should have a unique ID
      expect(alarm1.id.value).toBe('id-1');
      expect(alarm2.id.value).toBe('id-2');
      expect(alarm3.id.value).toBe('id-3');
      expect(globalMocks.idProvider.generate).toHaveBeenCalledTimes(3);
    });

    it('should handle different alarm names', () => {
      // Given: alarm properties with different names
      const names = ['Database Connection Error', 'Memory Usage High', 'Network Timeout', 'Disk Space Low'];
      const severity = AlarmSeverity.from('high');

      names.forEach((nameValue) => {
        const name = AlarmName.from(nameValue);

        // When: creating an alarm with the specific name
        const alarm = alarmFactory.create({ name, severity });

        // Then: it should create a valid alarm with the correct name
        expect(alarm.name.value).toBe(nameValue);
        expect(alarm.severity).toBe(severity);
        expect(alarm.createdAt).toBeInstanceOf(Date);
        expect(alarm.updatedAt).toBeInstanceOf(Date);
      });
    });

    it('should generate current timestamps', () => {
      // Given: alarm properties without timestamps
      const name = AlarmName.from('Timestamp Test');
      const severity = AlarmSeverity.from('low');
      const beforeCreation = new Date();

      // When: creating an alarm
      const alarm = alarmFactory.create({ name, severity });
      const afterCreation = new Date();

      // Then: it should generate current timestamps
      expect(alarm.createdAt).toBeInstanceOf(Date);
      expect(alarm.updatedAt).toBeInstanceOf(Date);
      expect(alarm.createdAt).toEqual(alarm.updatedAt);
      expect(alarm.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(alarm.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('should use the injected ID provider', () => {
      // Given: a mock ID provider with specific behavior
      const mockIdProvider = globalMocks.idProvider;
      const factory = new AlarmFactory(mockIdProvider);
      const name = AlarmName.from('ID Provider Test');
      const severity = AlarmSeverity.from('critical');

      // When: creating an alarm using the factory
      const alarm = factory.create({ name, severity });

      // Then: it should use the injected ID provider
      expect(mockIdProvider.generate).toHaveBeenCalledTimes(1);
      expect(alarm.id.value).toBeDefined();
      expect(typeof alarm.id.value).toBe('string');
      expect(alarm.createdAt).toBeInstanceOf(Date);
      expect(alarm.updatedAt).toBeInstanceOf(Date);
    });

    it('should create alarm with custom triggeredAt time', () => {
      // Given: alarm properties with custom triggeredAt time
      const name = AlarmName.from('Custom Trigger Time');
      const severity = AlarmSeverity.from('high');
      const customTriggerTime = new Date('2024-01-01T10:00:00.000Z');

      // When: creating an alarm with custom triggeredAt
      const alarm = alarmFactory.create({ name, severity, triggeredAt: customTriggerTime });

      // Then: it should use the custom triggeredAt time
      expect(alarm.triggeredAt).toBe(customTriggerTime);
      expect(alarm.isAcknowledged).toBe(false);
      expect(alarm.entries).toEqual([]);
    });

    it('should create alarm with custom acknowledgment state', () => {
      // Given: alarm properties with custom acknowledgment state
      const name = AlarmName.from('Acknowledged Alarm');
      const severity = AlarmSeverity.from('medium');
      const isAcknowledged = true;

      // When: creating an alarm with custom acknowledgment state
      const alarm = alarmFactory.create({ name, severity, isAcknowledged });

      // Then: it should use the custom acknowledgment state
      expect(alarm.isAcknowledged).toBe(true);
      expect(alarm.triggeredAt).toBeInstanceOf(Date);
      expect(alarm.entries).toEqual([]);
    });

    it('should create alarm with custom entries', () => {
      // Given: alarm properties with custom entries
      const name = AlarmName.from('Alarm with Entries');
      const severity = AlarmSeverity.from('critical');
      const entry1 = AlarmEntry.create({
        id: AlarmEntryId.from(commonFixtures.validId()),
        name: AlarmEntryName.from('Database Connection Failed'),
        type: AlarmEntryType.from('database'),
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });
      const entry2 = AlarmEntry.create({
        id: AlarmEntryId.from(commonFixtures.validId()),
        name: AlarmEntryName.from('Network Timeout'),
        type: AlarmEntryType.from('network'),
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });
      const entries = [entry1, entry2];

      // When: creating an alarm with custom entries
      const alarm = alarmFactory.create({ name, severity, entries });

      // Then: it should use the custom entries
      expect(alarm.entries).toHaveLength(2);
      expect(alarm.entries[0]).toBe(entry1);
      expect(alarm.entries[1]).toBe(entry2);
      expect(alarm.triggeredAt).toBeInstanceOf(Date);
      expect(alarm.isAcknowledged).toBe(false);
    });

    it('should create alarm with all custom properties', () => {
      // Given: alarm properties with all custom values
      const name = AlarmName.from('Fully Custom Alarm');
      const severity = AlarmSeverity.from('low');
      const customTriggerTime = new Date('2024-01-15T14:30:00.000Z');
      const isAcknowledged = true;
      const entry = AlarmEntry.create({
        id: AlarmEntryId.from(commonFixtures.validId()),
        name: AlarmEntryName.from('Custom Entry'),
        type: AlarmEntryType.from('application'),
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });
      const entries = [entry];

      // When: creating an alarm with all custom properties
      const alarm = alarmFactory.create({
        name,
        severity,
        triggeredAt: customTriggerTime,
        isAcknowledged,
        entries,
      });

      // Then: it should use all custom properties
      expect(alarm.name).toBe(name);
      expect(alarm.severity).toBe(severity);
      expect(alarm.triggeredAt).toBe(customTriggerTime);
      expect(alarm.isAcknowledged).toBe(true);
      expect(alarm.entries).toHaveLength(1);
      expect(alarm.entries[0]).toBe(entry);
      expect(alarm.createdAt).toBeInstanceOf(Date);
      expect(alarm.updatedAt).toBeInstanceOf(Date);
    });

    it('should use default values when optional properties are not provided', () => {
      // Given: alarm properties with only required fields
      const name = AlarmName.from('Default Values Test');
      const severity = AlarmSeverity.from('high');

      // When: creating an alarm without optional properties
      const alarm = alarmFactory.create({ name, severity });

      // Then: it should use default values for optional properties
      expect(alarm.triggeredAt).toBeInstanceOf(Date);
      expect(alarm.isAcknowledged).toBe(false);
      expect(alarm.entries).toEqual([]);

      // Verify the triggeredAt is set to current time (within reasonable range)
      const now = new Date();
      const timeDiff = Math.abs(alarm.triggeredAt.getTime() - now.getTime());
      expect(timeDiff).toBeLessThan(1000); // Within 1 second
    });
  });

  describe('dependency injection', () => {
    it('should accept ID provider through constructor', () => {
      // Given: a mock ID provider
      const mockIdProvider = globalMocks.idProvider;

      // When: creating the factory with the ID provider
      const factory = new AlarmFactory(mockIdProvider);

      // Then: the factory should be created successfully
      expect(factory).toBeInstanceOf(AlarmFactory);
      expect(factory).toBeDefined();
    });

    it('should work with different ID provider implementations', () => {
      // Given: a custom ID provider mock
      const customIdProvider = {
        generate: () => 'custom-generated-id',
        isValid: () => true,
      };
      const factory = new AlarmFactory(customIdProvider);
      const name = AlarmName.from('Custom ID Test');
      const severity = AlarmSeverity.from('medium');

      // When: creating an alarm with the custom ID provider
      const alarm = factory.create({ name, severity });

      // Then: it should use the custom ID provider
      expect(alarm.id.value).toBe('custom-generated-id');
      expect(alarm.name).toBe(name);
      expect(alarm.severity).toBe(severity);
      expect(alarm.createdAt).toBeInstanceOf(Date);
      expect(alarm.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('error handling', () => {
    it('should propagate validation errors from value objects', () => {
      // Given: invalid alarm properties that will cause validation errors
      const severity = AlarmSeverity.from('high');

      // When & Then: creating an alarm with invalid name should throw ValidationError
      expect(() => {
        const invalidName = AlarmName.from(''); // This should throw
        alarmFactory.create({ name: invalidName, severity });
      }).toThrow('Alarm name cannot be empty');
    });

    it('should handle ID provider errors', () => {
      // Given: an ID provider that throws an error
      const failingIdProvider = {
        generate: () => {
          throw new Error('ID generation failed');
        },
        isValid: () => true,
      };
      const factory = new AlarmFactory(failingIdProvider);
      const name = AlarmName.from('Error Test');
      const severity = AlarmSeverity.from('critical');

      // When & Then: creating an alarm should propagate the ID provider error
      expect(() => {
        factory.create({ name, severity });
      }).toThrow('ID generation failed');
    });
  });
});
