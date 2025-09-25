import { describe, expect, it } from 'vitest';

import { ValidationError } from '@/shared/domain/errors/validation.error';

import { AlarmName } from './alarm-name.vo';

describe('Value Object: AlarmName', () => {
  describe('create', () => {
    it('should create an alarm name with valid string', () => {
      // Given: a valid alarm name string
      const validName = 'System Alert';

      // When: creating an AlarmName from the valid string
      const alarmName = AlarmName.from(validName);

      // Then: it should create a valid AlarmName instance with the correct value
      expect(alarmName).toBeInstanceOf(AlarmName);
      expect(alarmName.value).toBe(validName);
    });

    it('should trim leading and trailing whitespace', () => {
      // Given: an alarm name string with leading and trailing whitespace
      const nameWithWhitespace = '  System Alert  ';
      const expectedName = 'System Alert';

      // When: creating an AlarmName from the string with whitespace
      const alarmName = AlarmName.from(nameWithWhitespace);

      // Then: it should trim the whitespace and return the clean name
      expect(alarmName.value).toBe(expectedName);
    });

    it('should throw ValidationError for empty string', () => {
      // Given: an empty string as input
      const emptyString = '';

      // When & Then: attempting to create AlarmName should throw ValidationError
      expect(() => AlarmName.from(emptyString)).toThrow(ValidationError);
      expect(() => AlarmName.from(emptyString)).toThrow('Alarm name cannot be empty');
    });

    it('should throw ValidationError for whitespace-only string', () => {
      // Given: a string containing only whitespace characters
      const whitespaceOnly = '   ';

      // When & Then: attempting to create AlarmName should throw ValidationError
      expect(() => AlarmName.from(whitespaceOnly)).toThrow(ValidationError);
      expect(() => AlarmName.from(whitespaceOnly)).toThrow('Alarm name cannot be empty');
    });
  });

  describe('equals', () => {
    it('should return true for equal alarm names', () => {
      // Given: two AlarmName instances created from the same name string
      const name = 'System Alert';
      const alarmName1 = AlarmName.from(name);
      const alarmName2 = AlarmName.from(name);

      // When: comparing the two AlarmName instances for equality
      const result = alarmName1.equals(alarmName2);

      // Then: it should return true since they have the same value
      expect(result).toBe(true);
    });

    it('should return false for different alarm names', () => {
      // Given: two AlarmName instances created from different name strings
      const alarmName1 = AlarmName.from('System Alert');
      const alarmName2 = AlarmName.from('Database Error');

      // When: comparing the two AlarmName instances for equality
      const result = alarmName1.equals(alarmName2);

      // Then: it should return false since they have different values
      expect(result).toBe(false);
    });

    it('should return true for alarm names with same content but different whitespace', () => {
      // Given: two AlarmName instances with same content but different whitespace
      const alarmName1 = AlarmName.from('System Alert');
      const alarmName2 = AlarmName.from('  System Alert  ');

      // When: comparing the two AlarmName instances for equality
      const result = alarmName1.equals(alarmName2);

      // Then: it should return true since whitespace is trimmed and content is the same
      expect(result).toBe(true);
    });
  });
});
