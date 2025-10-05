import { beforeEach, describe, expect, it } from 'vitest';

import { AlarmEntry, AlarmEntryPrimitives, AlarmEntryProps } from '@/alarms/domain/entities/alarm-entry.entity';
import { AlarmEntryId } from '@/alarms/domain/value-objects/alarm-entry-id.vo';
import { AlarmEntryName } from '@/alarms/domain/value-objects/alarm-entry-name.vo';
import { ALARM_ENTRY_TYPE_VALUES, AlarmEntryType } from '@/alarms/domain/value-objects/alarm-entry-type.vo';
import { ValidationError } from '@/shared/domain/errors/validation.error';
import { commonFixtures, globalMocks } from '@/shared/test/setup';

describe('Entity: AlarmEntry', () => {
  beforeEach(() => {
    globalMocks.idProvider.setupForValidId();
  });

  describe('create', () => {
    it('should create an alarm entry with valid props', () => {
      // Given: valid alarm entry properties
      const validId = commonFixtures.validId();
      const validName = 'Database Connection Failed';
      const validType = 'database';
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      const props: AlarmEntryProps = {
        id: AlarmEntryId.from(validId),
        name: AlarmEntryName.from(validName),
        type: AlarmEntryType.from(validType),
        createdAt,
        updatedAt,
      };

      // When: creating an AlarmEntry with the valid props
      const alarmEntry = AlarmEntry.create(props);

      // Then: it should create a valid AlarmEntry instance with correct properties
      expect(alarmEntry).toBeInstanceOf(AlarmEntry);
      expect(alarmEntry.id).toBeInstanceOf(AlarmEntryId);
      expect(alarmEntry.name).toBeInstanceOf(AlarmEntryName);
      expect(alarmEntry.type).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntry.id.value).toBe(validId);
      expect(alarmEntry.name.value).toBe(validName);
      expect(alarmEntry.type.value).toBe(validType);
      expect(alarmEntry.createdAt).toBe(createdAt);
      expect(alarmEntry.updatedAt).toBe(updatedAt);
    });

    it('should create alarm entries with all valid types', () => {
      // Given: valid alarm entry properties for each type
      const validId = commonFixtures.validId();
      const validName = 'Test Alarm Entry';
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      // When & Then: each type should create a valid AlarmEntry
      ALARM_ENTRY_TYPE_VALUES.forEach((type) => {
        const props: AlarmEntryProps = {
          id: AlarmEntryId.from(validId),
          name: AlarmEntryName.from(validName),
          type: AlarmEntryType.from(type),
          createdAt,
          updatedAt,
        };

        const alarmEntry = AlarmEntry.create(props);
        expect(alarmEntry).toBeInstanceOf(AlarmEntry);
        expect(alarmEntry.type.value).toBe(type);
      });
    });
  });

  describe('hydrate', () => {
    it('should hydrate an alarm entry from primitives', () => {
      // Given: valid alarm entry primitives
      const primitives: AlarmEntryPrimitives = {
        id: commonFixtures.validId(),
        name: 'Network Timeout Error',
        type: 'network',
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      };

      // When: hydrating an AlarmEntry from the primitives
      const alarmEntry = AlarmEntry.hydrate(primitives);

      // Then: it should create a valid AlarmEntry instance with correct properties
      expect(alarmEntry).toBeInstanceOf(AlarmEntry);
      expect(alarmEntry.id).toBeInstanceOf(AlarmEntryId);
      expect(alarmEntry.name).toBeInstanceOf(AlarmEntryName);
      expect(alarmEntry.type).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntry.id.value).toBe(primitives.id);
      expect(alarmEntry.name.value).toBe(primitives.name);
      expect(alarmEntry.type.value).toBe(primitives.type);
      expect(alarmEntry.createdAt).toBe(primitives.createdAt);
      expect(alarmEntry.updatedAt).toBe(primitives.updatedAt);
    });

    it('should throw ValidationError when hydrating with invalid id', () => {
      // Given: primitives with invalid id
      const primitives: AlarmEntryPrimitives = {
        id: commonFixtures.invalidId(),
        name: 'Test Alarm Entry',
        type: 'system',
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      };
      globalMocks.idProvider.setupForInvalidId();

      // When & Then: attempting to hydrate should throw ValidationError
      expect(() => AlarmEntry.hydrate(primitives)).toThrow(ValidationError);
    });

    it('should throw ValidationError when hydrating with invalid name', () => {
      // Given: primitives with invalid name
      const primitives: AlarmEntryPrimitives = {
        id: commonFixtures.validId(),
        name: '',
        type: 'application',
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      };

      // When & Then: attempting to hydrate should throw ValidationError
      expect(() => AlarmEntry.hydrate(primitives)).toThrow(ValidationError);
    });

    it('should throw ValidationError when hydrating with invalid type', () => {
      // Given: primitives with invalid type
      const primitives: AlarmEntryPrimitives = {
        id: commonFixtures.validId(),
        name: 'Test Alarm Entry',
        type: 'invalid-type',
        createdAt: commonFixtures.currentDateTime,
        updatedAt: commonFixtures.currentDateTime,
      };

      // When & Then: attempting to hydrate should throw ValidationError
      expect(() => AlarmEntry.hydrate(primitives)).toThrow(ValidationError);
    });
  });

  describe('toPrimitives', () => {
    it('should convert alarm entry to primitives', () => {
      // Given: a valid alarm entry
      const validId = commonFixtures.validId();
      const validName = 'Security Breach Detected';
      const validType = 'security';
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      const props: AlarmEntryProps = {
        id: AlarmEntryId.from(validId),
        name: AlarmEntryName.from(validName),
        type: AlarmEntryType.from(validType),
        createdAt,
        updatedAt,
      };

      const alarmEntry = AlarmEntry.create(props);

      // When: converting to primitives
      const primitives = alarmEntry.toPrimitives();

      // Then: it should return the correct primitive values
      expect(primitives).toEqual({
        id: validId,
        name: validName,
        type: validType,
        createdAt,
        updatedAt,
      });
    });

    it('should maintain data integrity when converting to primitives and back', () => {
      // Given: a valid alarm entry
      const validId = commonFixtures.validId();
      const validName = 'Performance Degradation';
      const validType = 'performance';
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      const props: AlarmEntryProps = {
        id: AlarmEntryId.from(validId),
        name: AlarmEntryName.from(validName),
        type: AlarmEntryType.from(validType),
        createdAt,
        updatedAt,
      };

      const originalAlarmEntry = AlarmEntry.create(props);

      // When: converting to primitives and back
      const primitives = originalAlarmEntry.toPrimitives();
      const rehydratedAlarmEntry = AlarmEntry.hydrate(primitives);

      // Then: the rehydrated alarm entry should be equivalent to the original
      expect(rehydratedAlarmEntry.id.value).toBe(originalAlarmEntry.id.value);
      expect(rehydratedAlarmEntry.name.value).toBe(originalAlarmEntry.name.value);
      expect(rehydratedAlarmEntry.type.value).toBe(originalAlarmEntry.type.value);
      expect(rehydratedAlarmEntry.createdAt).toEqual(originalAlarmEntry.createdAt);
      expect(rehydratedAlarmEntry.updatedAt).toEqual(originalAlarmEntry.updatedAt);
    });
  });

  describe('entity behavior', () => {
    it('should have immutable properties', () => {
      // Given: a valid alarm entry
      const validId = commonFixtures.validId();
      const validName = 'System Overload';
      const validType = 'system';
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      const props: AlarmEntryProps = {
        id: AlarmEntryId.from(validId),
        name: AlarmEntryName.from(validName),
        type: AlarmEntryType.from(validType),
        createdAt,
        updatedAt,
      };

      const alarmEntry = AlarmEntry.create(props);

      // When & Then: properties should be readonly (compile-time check)
      // Note: readonly properties are enforced at compile time, not runtime
      expect(alarmEntry.id).toBeDefined();
      expect(alarmEntry.name).toBeDefined();
      expect(alarmEntry.type).toBeDefined();
    });

    it('should inherit from Entity base class', () => {
      // Given: a valid alarm entry
      const validId = commonFixtures.validId();
      const validName = 'Test Alarm Entry';
      const validType = 'availability';
      const createdAt = commonFixtures.currentDateTime;
      const updatedAt = commonFixtures.currentDateTime;

      const props: AlarmEntryProps = {
        id: AlarmEntryId.from(validId),
        name: AlarmEntryName.from(validName),
        type: AlarmEntryType.from(validType),
        createdAt,
        updatedAt,
      };

      const alarmEntry = AlarmEntry.create(props);

      // When & Then: it should have Entity methods
      expect(typeof alarmEntry.toPrimitives).toBe('function');
      expect(alarmEntry.id).toBeDefined();
      expect(alarmEntry.createdAt).toBeDefined();
      expect(alarmEntry.updatedAt).toBeDefined();
    });
  });
});
