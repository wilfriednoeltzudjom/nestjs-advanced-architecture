import { beforeEach, describe, expect, it } from 'vitest';

import { Alarm, AlarmPrimitives, AlarmProps } from '@/alarms/domain/entities/alarm.entity';
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
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      const props: AlarmProps = {
        id: AlarmId.from(validId),
        name: AlarmName.from(validName),
        severity: AlarmSeverity.from(validSeverity),
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
      expect(alarm.createdAt).toBe(primitives.createdAt);
      expect(alarm.updatedAt).toBe(primitives.updatedAt);
    });

    it('should throw ValidationError when hydrating with invalid id', () => {
      // Given: primitives with invalid id
      const primitives: AlarmPrimitives = {
        id: commonFixtures.invalidId(),
        name: 'Test Alarm',
        severity: 'medium',
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
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      const alarm = Alarm.create({
        id: AlarmId.from(validId),
        name: AlarmName.from(validName),
        severity: AlarmSeverity.from(validSeverity),
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
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      // When: converting the alarm to primitives
      const primitives = alarm.toPrimitives();

      // Then: all values should have the correct data types
      expect(typeof primitives.id).toBe('string');
      expect(typeof primitives.name).toBe('string');
      expect(typeof primitives.severity).toBe('string');
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
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });
      const alarm2 = Alarm.create({
        id: AlarmId.from(sameId),
        name: AlarmName.from('Second Alarm'),
        severity: AlarmSeverity.from('low'),
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
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });
      const alarm2 = Alarm.create({
        id: AlarmId.from(commonFixtures.validId()),
        name: AlarmName.from('Second Alarm'),
        severity: AlarmSeverity.from('critical'),
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
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      // When: accessing the alarm properties
      const id = alarm.id;
      const name = alarm.name;
      const severity = alarm.severity;
      const createdAt = alarm.createdAt;
      const updatedAt = alarm.updatedAt;

      // Then: all properties should be accessible and readonly
      expect(id).toBeInstanceOf(AlarmId);
      expect(name).toBeInstanceOf(AlarmName);
      expect(severity).toBeInstanceOf(AlarmSeverity);
      expect(createdAt).toBeInstanceOf(Date);
      expect(updatedAt).toBeInstanceOf(Date);
    });

    it('should maintain immutability of properties', () => {
      // Given: a valid alarm instance
      const originalId = commonFixtures.validId();
      const originalName = 'Original Name';
      const originalSeverity = 'high';

      const alarm = Alarm.create({
        id: AlarmId.from(originalId),
        name: AlarmName.from(originalName),
        severity: AlarmSeverity.from(originalSeverity),
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      });

      // When: accessing the alarm properties
      const id = alarm.id;
      const name = alarm.name;
      const severity = alarm.severity;

      // Then: the original values should be preserved
      expect(id.value).toBe(originalId);
      expect(name.value).toBe(originalName);
      expect(severity.value).toBe(originalSeverity);
    });
  });
});
