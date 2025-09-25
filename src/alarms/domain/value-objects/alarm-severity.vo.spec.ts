import { describe, expect, it } from 'vitest';

import { ALARM_SEVERITY_VALUES, AlarmSeverity } from './alarm-severity.vo';

describe('Value Object: AlarmSeverity', () => {
  describe('create', () => {
    it('should create an alarm severity with valid critical value', () => {
      // Given: a valid critical severity string
      const criticalSeverity = 'critical';

      // When: creating an AlarmSeverity from the critical value
      const alarmSeverity = AlarmSeverity.from(criticalSeverity);

      // Then: it should create a valid AlarmSeverity instance with the correct value
      expect(alarmSeverity).toBeInstanceOf(AlarmSeverity);
      expect(alarmSeverity.value).toBe(criticalSeverity);
    });

    it('should create an alarm severity with valid high value', () => {
      // Given: a valid high severity string
      const highSeverity = 'high';

      // When: creating an AlarmSeverity from the high value
      const alarmSeverity = AlarmSeverity.from(highSeverity);

      // Then: it should create a valid AlarmSeverity instance with the correct value
      expect(alarmSeverity).toBeInstanceOf(AlarmSeverity);
      expect(alarmSeverity.value).toBe(highSeverity);
    });

    it('should create an alarm severity with valid medium value', () => {
      // Given: a valid medium severity string
      const mediumSeverity = 'medium';

      // When: creating an AlarmSeverity from the medium value
      const alarmSeverity = AlarmSeverity.from(mediumSeverity);

      // Then: it should create a valid AlarmSeverity instance with the correct value
      expect(alarmSeverity).toBeInstanceOf(AlarmSeverity);
      expect(alarmSeverity.value).toBe(mediumSeverity);
    });

    it('should create an alarm severity with valid low value', () => {
      // Given: a valid low severity string
      const lowSeverity = 'low';

      // When: creating an AlarmSeverity from the low value
      const alarmSeverity = AlarmSeverity.from(lowSeverity);

      // Then: it should create a valid AlarmSeverity instance with the correct value
      expect(alarmSeverity).toBeInstanceOf(AlarmSeverity);
      expect(alarmSeverity.value).toBe(lowSeverity);
    });
  });

  describe('equals', () => {
    it('should return true for equal alarm severities', () => {
      // Given: two AlarmSeverity instances created from the same severity string
      const severity = 'critical';
      const alarmSeverity1 = AlarmSeverity.from(severity);
      const alarmSeverity2 = AlarmSeverity.from(severity);

      // When: comparing the two AlarmSeverity instances for equality
      const result = alarmSeverity1.equals(alarmSeverity2);

      // Then: it should return true since they have the same value
      expect(result).toBe(true);
    });

    it('should return false for different alarm severities', () => {
      // Given: two AlarmSeverity instances created from different severity strings
      const alarmSeverity1 = AlarmSeverity.from('critical');
      const alarmSeverity2 = AlarmSeverity.from('low');

      // When: comparing the two AlarmSeverity instances for equality
      const result = alarmSeverity1.equals(alarmSeverity2);

      // Then: it should return false since they have different values
      expect(result).toBe(false);
    });
  });

  describe('ALARM_SEVERITY_VALUES', () => {
    it('should contain all expected severity values', () => {
      // Given: the expected list of valid severity values
      const expectedValues = ['critical', 'high', 'medium', 'low'];

      // When: accessing the ALARM_SEVERITY_VALUES constant
      const actualValues = ALARM_SEVERITY_VALUES;

      // Then: it should contain all the expected severity values
      expect(actualValues).toEqual(expectedValues);
    });
  });
});
