import { beforeEach, describe, expect, it } from 'vitest';

import { Alarm, AlarmPrimitives, AlarmProps } from '@/alarms/domain/entities/alarm.entity';
import { AlarmEntry } from '@/alarms/domain/entities/alarm-entry.entity';
import { AlarmEntryId } from '@/alarms/domain/value-objects/alarm-entry-id.vo';
import { AlarmEntryName } from '@/alarms/domain/value-objects/alarm-entry-name.vo';
import { AlarmEntryType } from '@/alarms/domain/value-objects/alarm-entry-type.vo';
import { AlarmId } from '@/alarms/domain/value-objects/alarm-id.vo';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity.vo';
import { ValidationError } from '@/shared/domain/errors/validation.error';
import { commonFixtures, globalMocks } from '@/shared/test/setup';

describe('Entity: Alarm', () => {
  beforeEach(() => {
    globalMocks.idProvider.setupForValidId();
  });

  describe('create', () => {
    it('should create an alarm with valid props', () => {
      // Given: valid alarm properties
      const validId = commonFixtures.validId();
      const validName = 'System Alert';
      const validSeverity = 'critical';
      const triggeredAt = commonFixtures.currentDateTime;
      const isAcknowledged = false;
      const entries: AlarmEntry[] = [];
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      const props: AlarmProps = {
        id: AlarmId.from(validId),
        name: AlarmName.from(validName),
        severity: AlarmSeverity.from(validSeverity),
        triggeredAt,
        isAcknowledged,
        entries,
        createdAt,
        updatedAt,
      };

      // When: creating an Alarm with the valid props
      const alarm = Alarm.create(props);

      // Then: it should create a valid Alarm instance with correct properties
      expect(alarm).toBeInstanceOf(Alarm);
      expect(alarm.id).toBeInstanceOf(AlarmId);
      expect(alarm.name).toBeInstanceOf(AlarmName);
      expect(alarm.severity).toBeInstanceOf(AlarmSeverity);
      expect(alarm.id.value).toBe(validId);
      expect(alarm.name.value).toBe(validName);
      expect(alarm.severity.value).toBe(validSeverity);
      expect(alarm.triggeredAt).toBe(triggeredAt);
      expect(alarm.isAcknowledged).toBe(isAcknowledged);
      expect(alarm.entries).toBe(entries);
      expect(alarm.createdAt).toBe(createdAt);
      expect(alarm.updatedAt).toBe(updatedAt);
    });

    it('should create an alarm with different severity levels', () => {
      // Given: alarm props with different severity levels
      const severities = ['critical', 'high', 'medium', 'low'] as const;

      severities.forEach((severity) => {
        const props: AlarmProps = {
          id: AlarmId.from(commonFixtures.validId()),
          name: AlarmName.from('Test Alarm'),
          severity: AlarmSeverity.from(severity),
          triggeredAt: commonFixtures.currentDateTime,
          isAcknowledged: false,
          entries: [],
          createdAt: commonFixtures.currentDateTime,
          updatedAt: commonFixtures.currentDateTime,
        };

        // When: creating an Alarm with the specific severity
        const alarm = Alarm.create(props);

        // Then: it should create a valid Alarm with the correct severity
        expect(alarm.severity.value).toBe(severity);
      });
    });
  });

  describe('hydrate', () => {
    it('should hydrate an alarm from primitives', () => {
      // Given: valid alarm primitives
      const primitives: AlarmPrimitives = {
        id: commonFixtures.validId(),
        name: 'Database Error',
        severity: 'high',
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: true,
        entries: [
          {
            id: commonFixtures.validId(),
            name: 'Connection Failed',
            type: 'database',
            createdAt: commonFixtures.currentDateTime,
            updatedAt: commonFixtures.currentDateTime,
          },
        ],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      };

      // When: hydrating an Alarm from the primitives
      const alarm = Alarm.hydrate(primitives);

      // Then: it should create a valid Alarm instance with correct properties
      expect(alarm).toBeInstanceOf(Alarm);
      expect(alarm.id).toBeInstanceOf(AlarmId);
      expect(alarm.name).toBeInstanceOf(AlarmName);
      expect(alarm.severity).toBeInstanceOf(AlarmSeverity);
      expect(alarm.id.value).toBe(primitives.id);
      expect(alarm.name.value).toBe(primitives.name);
      expect(alarm.severity.value).toBe(primitives.severity);
      expect(alarm.triggeredAt).toBe(primitives.triggeredAt);
      expect(alarm.isAcknowledged).toBe(primitives.isAcknowledged);
      expect(alarm.entries).toHaveLength(1);
      expect(alarm.entries[0]).toBeInstanceOf(AlarmEntry);
      expect(alarm.entries[0].name.value).toBe('Connection Failed');
      expect(alarm.entries[0].type.value).toBe('database');
      expect(alarm.createdAt).toBe(primitives.createdAt);
      expect(alarm.updatedAt).toBe(primitives.updatedAt);
    });

    it('should throw ValidationError when hydrating with invalid id', () => {
      // Given: primitives with invalid id
      const primitives: AlarmPrimitives = {
        id: commonFixtures.invalidId(),
        name: 'Test Alarm',
        severity: 'medium',
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: false,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      };
      globalMocks.idProvider.setupForInvalidId();

      // When & Then: attempting to hydrate should throw ValidationError
      expect(() => Alarm.hydrate(primitives)).toThrow(ValidationError);
    });

    it('should throw ValidationError when hydrating with invalid name', () => {
      // Given: primitives with invalid name
      const primitives: AlarmPrimitives = {
        id: commonFixtures.validId(),
        name: '', // empty name
        severity: 'low',
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: false,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      };

      // When & Then: attempting to hydrate should throw ValidationError
      expect(() => Alarm.hydrate(primitives)).toThrow(ValidationError);
    });

    it('should throw ValidationError when hydrating with invalid severity', () => {
      // Given: primitives with invalid severity
      const primitives: AlarmPrimitives = {
        id: commonFixtures.validId(),
        name: 'Test Alarm',
        severity: 'invalid-severity',
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: false,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      };

      // When & Then: attempting to hydrate should throw ValidationError
      expect(() => Alarm.hydrate(primitives)).toThrow(ValidationError);
    });
  });

  describe('toPrimitives', () => {
    it('should convert alarm to primitives', () => {
      // Given: a valid alarm instance
      const validId = commonFixtures.validId();
      const validName = 'Network Timeout';
      const validSeverity = 'critical';
      const triggeredAt = commonFixtures.currentDateTime;
      const isAcknowledged = true;
      const entries: AlarmEntry[] = [];
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      const alarm = Alarm.create({
        id: AlarmId.from(validId),
        name: AlarmName.from(validName),
        severity: AlarmSeverity.from(validSeverity),
        triggeredAt,
        isAcknowledged,
        entries,
        createdAt,
        updatedAt,
      });

      // When: converting the alarm to primitives
      const primitives = alarm.toPrimitives();

      // Then: it should return the correct primitive values
      expect(primitives).toEqual({
        id: validId,
        name: validName,
        severity: validSeverity,
        triggeredAt,
        isAcknowledged,
        entries: [],
        createdAt,
        updatedAt,
      });
    });

    it('should return primitives with correct data types', () => {
      // Given: a valid alarm instance
      const alarm = Alarm.create({
        id: AlarmId.from(commonFixtures.validId()),
        name: AlarmName.from('Test Alarm'),
        severity: AlarmSeverity.from('high'),
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: false,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      // When: converting the alarm to primitives
      const primitives = alarm.toPrimitives();

      // Then: all values should have the correct data types
      expect(typeof primitives.id).toBe('string');
      expect(typeof primitives.name).toBe('string');
      expect(typeof primitives.severity).toBe('string');
      expect(primitives.triggeredAt).toBeInstanceOf(Date);
      expect(typeof primitives.isAcknowledged).toBe('boolean');
      expect(Array.isArray(primitives.entries)).toBe(true);
      expect(primitives.createdAt).toBeInstanceOf(Date);
      expect(primitives.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('equals', () => {
    it('should return true for alarms with the same id', () => {
      // Given: two alarm instances with the same id
      const sameId = commonFixtures.validId();
      const alarm1 = Alarm.create({
        id: AlarmId.from(sameId),
        name: AlarmName.from('First Alarm'),
        severity: AlarmSeverity.from('critical'),
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: false,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });
      const alarm2 = Alarm.create({
        id: AlarmId.from(sameId),
        name: AlarmName.from('Second Alarm'),
        severity: AlarmSeverity.from('low'),
        triggeredAt: new Date('2024-01-01T00:00:00.000Z'),
        isAcknowledged: true,
        entries: [],
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      });

      // When: comparing the two alarm instances for equality
      const result = alarm1.equals(alarm2);

      // Then: it should return true since they have the same id
      expect(result).toBe(true);
    });

    it('should return false for alarms with different ids', () => {
      // Given: two alarm instances with different ids
      const alarm1 = Alarm.create({
        id: AlarmId.from(commonFixtures.validId()),
        name: AlarmName.from('First Alarm'),
        severity: AlarmSeverity.from('critical'),
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: false,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });
      const alarm2 = Alarm.create({
        id: AlarmId.from(commonFixtures.validId()),
        name: AlarmName.from('Second Alarm'),
        severity: AlarmSeverity.from('critical'),
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: false,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      // When: comparing the two alarm instances for equality
      const result = alarm1.equals(alarm2);

      // Then: it should return false since they have different ids
      expect(result).toBe(false);
    });
  });

  describe('properties', () => {
    it('should have readonly properties', () => {
      // Given: a valid alarm instance
      const alarm = Alarm.create({
        id: AlarmId.from(commonFixtures.validId()),
        name: AlarmName.from('Test Alarm'),
        severity: AlarmSeverity.from('medium'),
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: false,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      // When: accessing the alarm properties
      const id = alarm.id;
      const name = alarm.name;
      const severity = alarm.severity;
      const triggeredAt = alarm.triggeredAt;
      const isAcknowledged = alarm.isAcknowledged;
      const entries = alarm.entries;
      const createdAt = alarm.createdAt;
      const updatedAt = alarm.updatedAt;

      // Then: all properties should be accessible and readonly
      expect(id).toBeInstanceOf(AlarmId);
      expect(name).toBeInstanceOf(AlarmName);
      expect(severity).toBeInstanceOf(AlarmSeverity);
      expect(triggeredAt).toBeInstanceOf(Date);
      expect(typeof isAcknowledged).toBe('boolean');
      expect(Array.isArray(entries)).toBe(true);
      expect(createdAt).toBeInstanceOf(Date);
      expect(updatedAt).toBeInstanceOf(Date);
    });

    it('should maintain immutability of properties', () => {
      // Given: a valid alarm instance
      const originalId = commonFixtures.validId();
      const originalName = 'Original Name';
      const originalSeverity = 'high';
      const originalTriggeredAt = commonFixtures.currentDateTime;
      const originalIsAcknowledged = false;
      const originalEntries: AlarmEntry[] = [];

      const alarm = Alarm.create({
        id: AlarmId.from(originalId),
        name: AlarmName.from(originalName),
        severity: AlarmSeverity.from(originalSeverity),
        triggeredAt: originalTriggeredAt,
        isAcknowledged: originalIsAcknowledged,
        entries: originalEntries,
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      // When: accessing the alarm properties
      const id = alarm.id;
      const name = alarm.name;
      const severity = alarm.severity;
      const triggeredAt = alarm.triggeredAt;
      const isAcknowledged = alarm.isAcknowledged;
      const entries = alarm.entries;

      // Then: the original values should be preserved
      expect(id.value).toBe(originalId);
      expect(name.value).toBe(originalName);
      expect(severity.value).toBe(originalSeverity);
      expect(triggeredAt).toBe(originalTriggeredAt);
      expect(isAcknowledged).toBe(originalIsAcknowledged);
      expect(entries).toBe(originalEntries);
    });
  });

  describe('new properties', () => {
    it('should handle alarm entries correctly', () => {
      // Given: alarm entry data
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

      // When: creating an alarm with entries
      const alarm = Alarm.create({
        id: AlarmId.from(commonFixtures.validId()),
        name: AlarmName.from('System Alert'),
        severity: AlarmSeverity.from('critical'),
        triggeredAt: commonFixtures.currentDateTime,
        isAcknowledged: false,
        entries,
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      // Then: the alarm should contain the entries
      expect(alarm.entries).toHaveLength(2);
      expect(alarm.entries[0]).toBe(entry1);
      expect(alarm.entries[1]).toBe(entry2);
    });

    it('should handle different acknowledgment states', () => {
      // Given: alarm props with different acknowledgment states
      const acknowledgedStates = [true, false];

      acknowledgedStates.forEach((isAcknowledged) => {
        // When: creating an alarm with the specific acknowledgment state
        const alarm = Alarm.create({
          id: AlarmId.from(commonFixtures.validId()),
          name: AlarmName.from('Test Alarm'),
          severity: AlarmSeverity.from('medium'),
          triggeredAt: commonFixtures.currentDateTime,
          isAcknowledged,
          entries: [],
          createdAt: commonFixtures.currentDateTime,
          updatedAt: commonFixtures.currentDateTime,
        });

        // Then: the alarm should have the correct acknowledgment state
        expect(alarm.isAcknowledged).toBe(isAcknowledged);
      });
    });

    it('should handle different trigger times', () => {
      // Given: different trigger times
      const triggerTime1 = new Date('2024-01-01T10:00:00.000Z');
      const triggerTime2 = new Date('2024-01-02T15:30:00.000Z');

      // When: creating alarms with different trigger times
      const alarm1 = Alarm.create({
        id: AlarmId.from(commonFixtures.validId()),
        name: AlarmName.from('First Alarm'),
        severity: AlarmSeverity.from('high'),
        triggeredAt: triggerTime1,
        isAcknowledged: false,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      const alarm2 = Alarm.create({
        id: AlarmId.from(commonFixtures.validId()),
        name: AlarmName.from('Second Alarm'),
        severity: AlarmSeverity.from('low'),
        triggeredAt: triggerTime2,
        isAcknowledged: true,
        entries: [],
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      // Then: each alarm should have its correct trigger time
      expect(alarm1.triggeredAt).toBe(triggerTime1);
      expect(alarm2.triggeredAt).toBe(triggerTime2);
    });
  });
});
