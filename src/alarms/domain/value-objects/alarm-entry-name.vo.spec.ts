import { describe, expect, it } from 'vitest';

import { ValidationError } from '@/shared/domain/errors/validation.error';

import { AlarmEntryName } from './alarm-entry-name.vo';

describe('Value Object: AlarmEntryName', () => {
  describe('create', () => {
    it('should create an alarm entry name with valid string', () => {
      // Given: a valid alarm entry name string
      const validName = 'Database Connection Failed';

      // When: creating an AlarmEntryName from the valid string
      const alarmEntryName = AlarmEntryName.from(validName);

      // Then: it should create a valid AlarmEntryName instance with the correct value
      expect(alarmEntryName).toBeInstanceOf(AlarmEntryName);
      expect(alarmEntryName.value).toBe(validName);
    });

    it('should trim leading and trailing whitespace', () => {
      // Given: an alarm entry name string with leading and trailing whitespace
      const nameWithWhitespace = '  Database Connection Failed  ';
      const expectedName = 'Database Connection Failed';

      // When: creating an AlarmEntryName from the string with whitespace
      const alarmEntryName = AlarmEntryName.from(nameWithWhitespace);

      // Then: it should trim the whitespace and return the clean name
      expect(alarmEntryName.value).toBe(expectedName);
    });

    it('should throw ValidationError for empty string', () => {
      // Given: an empty string as input
      const emptyString = '';

      // When & Then: attempting to create AlarmEntryName should throw ValidationError
      expect(() => AlarmEntryName.from(emptyString)).toThrow(ValidationError);
      expect(() => AlarmEntryName.from(emptyString)).toThrow('Alarm entry name cannot be empty');
    });

    it('should throw ValidationError for whitespace-only string', () => {
      // Given: a string containing only whitespace characters
      const whitespaceOnly = '   ';

      // When & Then: attempting to create AlarmEntryName should throw ValidationError
      expect(() => AlarmEntryName.from(whitespaceOnly)).toThrow(ValidationError);
      expect(() => AlarmEntryName.from(whitespaceOnly)).toThrow('Alarm entry name cannot be empty');
    });

    it('should create alarm entry name with single character', () => {
      // Given: a single character string
      const singleChar = 'A';

      // When: creating an AlarmEntryName from the single character
      const alarmEntryName = AlarmEntryName.from(singleChar);

      // Then: it should create a valid AlarmEntryName instance
      expect(alarmEntryName).toBeInstanceOf(AlarmEntryName);
      expect(alarmEntryName.value).toBe(singleChar);
    });

    it('should create alarm entry name with long descriptive text', () => {
      // Given: a long descriptive alarm entry name
      const longName = 'High CPU usage detected on server node-01 in production environment';

      // When: creating an AlarmEntryName from the long name
      const alarmEntryName = AlarmEntryName.from(longName);

      // Then: it should create a valid AlarmEntryName instance
      expect(alarmEntryName).toBeInstanceOf(AlarmEntryName);
      expect(alarmEntryName.value).toBe(longName);
    });
  });

  describe('equals', () => {
    it('should return true when comparing two AlarmEntryNames with the same value', () => {
      // Given: two AlarmEntryNames with the same value
      const nameValue = 'Database Connection Failed';
      const alarmEntryName1 = AlarmEntryName.from(nameValue);
      const alarmEntryName2 = AlarmEntryName.from(nameValue);

      // When: comparing the two AlarmEntryNames
      const result = alarmEntryName1.equals(alarmEntryName2);

      // Then: they should be equal
      expect(result).toBe(true);
    });

    it('should return false when comparing two AlarmEntryNames with different values', () => {
      // Given: two AlarmEntryNames with different values
      const nameValue1 = 'Database Connection Failed';
      const nameValue2 = 'Memory Usage High';
      const alarmEntryName1 = AlarmEntryName.from(nameValue1);
      const alarmEntryName2 = AlarmEntryName.from(nameValue2);

      // When: comparing the two AlarmEntryNames
      const result = alarmEntryName1.equals(alarmEntryName2);

      // Then: they should not be equal
      expect(result).toBe(false);
    });

    it('should return true when comparing names that are equivalent after trimming', () => {
      // Given: two AlarmEntryNames that are equivalent after trimming
      const nameValue1 = 'Database Connection Failed';
      const nameValue2 = '  Database Connection Failed  ';
      const alarmEntryName1 = AlarmEntryName.from(nameValue1);
      const alarmEntryName2 = AlarmEntryName.from(nameValue2);

      // When: comparing the two AlarmEntryNames
      const result = alarmEntryName1.equals(alarmEntryName2);

      // Then: they should be equal
      expect(result).toBe(true);
    });
  });
});
