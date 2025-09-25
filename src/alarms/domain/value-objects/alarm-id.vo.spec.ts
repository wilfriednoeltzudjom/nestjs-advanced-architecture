import { beforeEach, describe, expect, it } from 'vitest';

import { ValidationError } from '@/shared/domain/errors/validation.error';
import { commonFixtures, globalMocks } from '@/shared/test/setup';

import { AlarmId } from './alarm-id.vo';

describe('Value Object: AlarmId', () => {
  describe('create', () => {
    it('should create an alarm ID with valid string', () => {
      // Given: a valid ID string
      const validId = commonFixtures.validId();
      globalMocks.idProvider.setupForValidId();

      // When: creating an AlarmId from the valid string
      const alarmId = AlarmId.from(validId);

      // Then: it should create a valid AlarmId instance with the correct value
      expect(alarmId).toBeInstanceOf(AlarmId);
      expect(alarmId.value).toBe(validId);
      expect(globalMocks.idProvider.isValid).toHaveBeenCalledWith(validId);
    });

    it('should throw ValidationError for empty string', () => {
      // Given: an empty string as input
      const emptyString = '';

      // When & Then: attempting to create AlarmId should throw ValidationError
      expect(() => AlarmId.from(emptyString)).toThrow(ValidationError);
      expect(() => AlarmId.from(emptyString)).toThrow('Alarm ID cannot be empty');
      expect(globalMocks.idProvider.isValid).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid ID format', () => {
      // Given: an invalid ID string
      const invalidId = commonFixtures.invalidId();
      globalMocks.idProvider.setupForInvalidId();

      // When & Then: attempting to create AlarmId should throw ValidationError
      expect(() => AlarmId.from(invalidId)).toThrow(ValidationError);
      expect(() => AlarmId.from(invalidId)).toThrow('Invalid unique identifier');
      expect(globalMocks.idProvider.isValid).toHaveBeenCalledWith(invalidId);
    });
  });

  describe('equals', () => {
    beforeEach(() => {
      globalMocks.idProvider.setupForValidId();
    });

    it('should return true for equal alarm IDs', () => {
      // Given: two AlarmId instances created from the same ID string
      const id = commonFixtures.validId();
      const alarmId1 = AlarmId.from(id);
      const alarmId2 = AlarmId.from(id);

      // When: comparing the two AlarmId instances for equality
      const result = alarmId1.equals(alarmId2);

      // Then: it should return true since they have the same value
      expect(result).toBe(true);
    });

    it('should return false for different alarm IDs', () => {
      // Given: two AlarmId instances created from different ID strings
      const id1 = commonFixtures.validId();
      const id2 = commonFixtures.validId();
      const alarmId1 = AlarmId.from(id1);
      const alarmId2 = AlarmId.from(id2);

      // When: comparing the two AlarmId instances for equality
      const result = alarmId1.equals(alarmId2);

      // Then: it should return false since they have different values
      expect(result).toBe(false);
    });
  });
});
