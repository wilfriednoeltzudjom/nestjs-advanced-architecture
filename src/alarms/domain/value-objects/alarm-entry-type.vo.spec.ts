import { describe, expect, it } from 'vitest';

import { ValidationError } from '@/shared/domain/errors/validation.error';

import { ALARM_ENTRY_TYPE_VALUES, AlarmEntryType } from './alarm-entry-type.vo';

describe('Value Object: AlarmEntryType', () => {
  describe('create', () => {
    it('should create an alarm entry type with valid system value', () => {
      // Given: a valid system type string
      const systemType = 'system';

      // When: creating an AlarmEntryType from the system value
      const alarmEntryType = AlarmEntryType.from(systemType);

      // Then: it should create a valid AlarmEntryType instance with the correct value
      expect(alarmEntryType).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntryType.value).toBe(systemType);
    });

    it('should create an alarm entry type with valid network value', () => {
      // Given: a valid network type string
      const networkType = 'network';

      // When: creating an AlarmEntryType from the network value
      const alarmEntryType = AlarmEntryType.from(networkType);

      // Then: it should create a valid AlarmEntryType instance with the correct value
      expect(alarmEntryType).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntryType.value).toBe(networkType);
    });

    it('should create an alarm entry type with valid database value', () => {
      // Given: a valid database type string
      const databaseType = 'database';

      // When: creating an AlarmEntryType from the database value
      const alarmEntryType = AlarmEntryType.from(databaseType);

      // Then: it should create a valid AlarmEntryType instance with the correct value
      expect(alarmEntryType).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntryType.value).toBe(databaseType);
    });

    it('should create an alarm entry type with valid application value', () => {
      // Given: a valid application type string
      const applicationType = 'application';

      // When: creating an AlarmEntryType from the application value
      const alarmEntryType = AlarmEntryType.from(applicationType);

      // Then: it should create a valid AlarmEntryType instance with the correct value
      expect(alarmEntryType).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntryType.value).toBe(applicationType);
    });

    it('should create an alarm entry type with valid security value', () => {
      // Given: a valid security type string
      const securityType = 'security';

      // When: creating an AlarmEntryType from the security value
      const alarmEntryType = AlarmEntryType.from(securityType);

      // Then: it should create a valid AlarmEntryType instance with the correct value
      expect(alarmEntryType).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntryType.value).toBe(securityType);
    });

    it('should create an alarm entry type with valid performance value', () => {
      // Given: a valid performance type string
      const performanceType = 'performance';

      // When: creating an AlarmEntryType from the performance value
      const alarmEntryType = AlarmEntryType.from(performanceType);

      // Then: it should create a valid AlarmEntryType instance with the correct value
      expect(alarmEntryType).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntryType.value).toBe(performanceType);
    });

    it('should create an alarm entry type with valid availability value', () => {
      // Given: a valid availability type string
      const availabilityType = 'availability';

      // When: creating an AlarmEntryType from the availability value
      const alarmEntryType = AlarmEntryType.from(availabilityType);

      // Then: it should create a valid AlarmEntryType instance with the correct value
      expect(alarmEntryType).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntryType.value).toBe(availabilityType);
    });

    it('should create an alarm entry type with valid capacity value', () => {
      // Given: a valid capacity type string
      const capacityType = 'capacity';

      // When: creating an AlarmEntryType from the capacity value
      const alarmEntryType = AlarmEntryType.from(capacityType);

      // Then: it should create a valid AlarmEntryType instance with the correct value
      expect(alarmEntryType).toBeInstanceOf(AlarmEntryType);
      expect(alarmEntryType.value).toBe(capacityType);
    });

    it('should throw ValidationError for invalid type value', () => {
      // Given: an invalid type string
      const invalidType = 'invalid-type';

      // When & Then: attempting to create AlarmEntryType should throw ValidationError
      expect(() => AlarmEntryType.from(invalidType)).toThrow(ValidationError);
      expect(() => AlarmEntryType.from(invalidType)).toThrow('Invalid alarm entry type');
    });

    it('should throw ValidationError for empty string', () => {
      // Given: an empty string as input
      const emptyString = '';

      // When & Then: attempting to create AlarmEntryType should throw ValidationError
      expect(() => AlarmEntryType.from(emptyString)).toThrow(ValidationError);
      expect(() => AlarmEntryType.from(emptyString)).toThrow('Invalid alarm entry type');
    });

    it('should throw ValidationError for null value', () => {
      // Given: a null value as input
      const nullValue = null as unknown as string;

      // When & Then: attempting to create AlarmEntryType should throw ValidationError
      expect(() => AlarmEntryType.from(nullValue)).toThrow(ValidationError);
      expect(() => AlarmEntryType.from(nullValue)).toThrow('Invalid alarm entry type');
    });

    it('should throw ValidationError for undefined value', () => {
      // Given: an undefined value as input
      const undefinedValue = undefined as unknown as string;

      // When & Then: attempting to create AlarmEntryType should throw ValidationError
      expect(() => AlarmEntryType.from(undefinedValue)).toThrow(ValidationError);
      expect(() => AlarmEntryType.from(undefinedValue)).toThrow('Invalid alarm entry type');
    });
  });

  describe('equals', () => {
    it('should return true when comparing two AlarmEntryTypes with the same value', () => {
      // Given: two AlarmEntryTypes with the same value
      const typeValue = 'system';
      const alarmEntryType1 = AlarmEntryType.from(typeValue);
      const alarmEntryType2 = AlarmEntryType.from(typeValue);

      // When: comparing the two AlarmEntryTypes
      const result = alarmEntryType1.equals(alarmEntryType2);

      // Then: they should be equal
      expect(result).toBe(true);
    });

    it('should return false when comparing two AlarmEntryTypes with different values', () => {
      // Given: two AlarmEntryTypes with different values
      const typeValue1 = 'system';
      const typeValue2 = 'network';
      const alarmEntryType1 = AlarmEntryType.from(typeValue1);
      const alarmEntryType2 = AlarmEntryType.from(typeValue2);

      // When: comparing the two AlarmEntryTypes
      const result = alarmEntryType1.equals(alarmEntryType2);

      // Then: they should not be equal
      expect(result).toBe(false);
    });
  });

  describe('ALARM_ENTRY_TYPE_VALUES constant', () => {
    it('should contain all expected alarm entry type values', () => {
      // Given: the expected alarm entry type values
      const expectedValues = [
        'system',
        'network',
        'database',
        'application',
        'security',
        'performance',
        'availability',
        'capacity',
      ];

      // When & Then: the constant should contain all expected values
      expect(ALARM_ENTRY_TYPE_VALUES).toEqual(expectedValues);
    });

    it('should allow creating AlarmEntryType from all values in the constant', () => {
      // Given: all values from the ALARM_ENTRY_TYPE_VALUES constant
      const typeValues = ALARM_ENTRY_TYPE_VALUES;

      // When & Then: each value should create a valid AlarmEntryType
      typeValues.forEach((typeValue) => {
        const alarmEntryType = AlarmEntryType.from(typeValue);
        expect(alarmEntryType).toBeInstanceOf(AlarmEntryType);
        expect(alarmEntryType.value).toBe(typeValue);
      });
    });
  });
});
