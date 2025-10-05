import { beforeEach, describe, expect, it } from 'vitest';

import { ValidationError } from '@/shared/domain/errors/validation.error';
import { commonFixtures, globalMocks } from '@/shared/test/setup';

import { AlarmEntryId } from './alarm-entry-id.vo';

describe('Value Object: AlarmEntryId', () => {
  describe('create', () => {
    it('should create an alarm entry ID with valid string', () => {
      // Given: a valid ID string
      const validId = commonFixtures.validId();
      globalMocks.idProvider.setupForValidId();

      // When: creating an AlarmEntryId from the valid string
      const alarmEntryId = AlarmEntryId.from(validId);

      // Then: it should create a valid AlarmEntryId instance with the correct value
      expect(alarmEntryId).toBeInstanceOf(AlarmEntryId);
      expect(alarmEntryId.value).toBe(validId);
      expect(globalMocks.idProvider.isValid).toHaveBeenCalledWith(validId);
    });

    it('should throw ValidationError for empty string', () => {
      // Given: an empty string as input
      const emptyString = '';

      // When & Then: attempting to create AlarmEntryId should throw ValidationError
      expect(() => AlarmEntryId.from(emptyString)).toThrow(ValidationError);
      expect(() => AlarmEntryId.from(emptyString)).toThrow('Alarm entry ID cannot be empty');
      expect(globalMocks.idProvider.isValid).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for whitespace-only string', () => {
      // Given: a string containing only whitespace characters
      const whitespaceOnly = '   ';

      // When & Then: attempting to create AlarmEntryId should throw ValidationError
      expect(() => AlarmEntryId.from(whitespaceOnly)).toThrow(ValidationError);
      expect(() => AlarmEntryId.from(whitespaceOnly)).toThrow('Alarm entry ID cannot be empty');
      expect(globalMocks.idProvider.isValid).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid ID format', () => {
      // Given: an invalid ID string
      const invalidId = commonFixtures.invalidId();
      globalMocks.idProvider.setupForInvalidId();

      // When & Then: attempting to create AlarmEntryId should throw ValidationError
      expect(() => AlarmEntryId.from(invalidId)).toThrow(ValidationError);
      expect(() => AlarmEntryId.from(invalidId)).toThrow('Invalid unique identifier');
      expect(globalMocks.idProvider.isValid).toHaveBeenCalledWith(invalidId);
    });

    it('should trim leading and trailing whitespace', () => {
      // Given: an ID string with leading and trailing whitespace
      const baseId = commonFixtures.validId();
      const idWithWhitespace = `  ${baseId}  `;
      globalMocks.idProvider.setupForValidId();

      // When: creating an AlarmEntryId from the string with whitespace
      const alarmEntryId = AlarmEntryId.from(idWithWhitespace);

      // Then: it should trim the whitespace and return the clean ID
      expect(alarmEntryId.value).toBe(baseId);
      expect(globalMocks.idProvider.isValid).toHaveBeenCalledWith(baseId);
    });
  });

  describe('equals', () => {
    beforeEach(() => {
      globalMocks.idProvider.setupForValidId();
    });

    it('should return true when comparing two AlarmEntryIds with the same value', () => {
      // Given: two AlarmEntryIds with the same value
      const idValue = commonFixtures.validId();
      const alarmEntryId1 = AlarmEntryId.from(idValue);
      const alarmEntryId2 = AlarmEntryId.from(idValue);

      // When: comparing the two AlarmEntryIds
      const result = alarmEntryId1.equals(alarmEntryId2);

      // Then: they should be equal
      expect(result).toBe(true);
    });

    it('should return false when comparing two AlarmEntryIds with different values', () => {
      // Given: two AlarmEntryIds with different values
      const idValue1 = commonFixtures.validId();
      const idValue2 = commonFixtures.validId();
      const alarmEntryId1 = AlarmEntryId.from(idValue1);
      const alarmEntryId2 = AlarmEntryId.from(idValue2);

      // When: comparing the two AlarmEntryIds
      const result = alarmEntryId1.equals(alarmEntryId2);

      // Then: they should not be equal
      expect(result).toBe(false);
    });
  });
});
