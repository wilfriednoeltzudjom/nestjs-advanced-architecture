import { beforeEach, describe, expect, it } from 'vitest';

import { AlarmEntry } from '@/alarms/domain/entities/alarm-entry.entity';
import { AlarmEntryFactory, CreateAlarmEntryProps } from '@/alarms/domain/factories/alarm-entry.factory';
import { AlarmEntryName } from '@/alarms/domain/value-objects/alarm-entry-name.vo';
import { AlarmEntryType } from '@/alarms/domain/value-objects/alarm-entry-type.vo';
import { commonFixtures, globalMocks } from '@/shared/test/setup';

describe('Factory: AlarmEntryFactory', () => {
  let alarmEntryFactory: AlarmEntryFactory;

  beforeEach(() => {
    globalMocks.idProvider.resetDefaults();
    globalMocks.idProvider.setupForValidId();
    alarmEntryFactory = new AlarmEntryFactory(globalMocks.idProvider);
  });

  describe('create', () => {
    it('should create an alarm entry with generated id and timestamps', () => {
      // Given: valid alarm entry properties
      const validName = 'Database Connection Failed';
      const validType = 'database';
      const generatedId = commonFixtures.validId();

      // Setup mock to return the expected ID
      globalMocks.idProvider.generate.mockReturnValue(generatedId);

      const createProps: CreateAlarmEntryProps = {
        name: AlarmEntryName.from(validName),
        type: AlarmEntryType.from(validType),
      };

      // When: creating an AlarmEntry using the factory
      const alarmEntry = alarmEntryFactory.create(createProps);

      // Then: it should create a valid AlarmEntry with generated values
      expect(alarmEntry).toBeInstanceOf(AlarmEntry);
      expect(alarmEntry.id.value).toBe(generatedId);
      expect(alarmEntry.name.value).toBe(validName);
      expect(alarmEntry.type.value).toBe(validType);
      expect(alarmEntry.createdAt).toBeInstanceOf(Date);
      expect(alarmEntry.updatedAt).toBeInstanceOf(Date);
      expect(globalMocks.idProvider.generate).toHaveBeenCalledTimes(1);
    });

    it('should create alarm entries with different types', () => {
      // Given: valid alarm entry properties with different types
      const validName = 'System Alert';
      const types = ['system', 'network', 'application', 'security'] as const;

      // When & Then: each type should create a valid AlarmEntry
      types.forEach((type) => {
        const createProps: CreateAlarmEntryProps = {
          name: AlarmEntryName.from(validName),
          type: AlarmEntryType.from(type),
        };

        const alarmEntry = alarmEntryFactory.create(createProps);
        expect(alarmEntry).toBeInstanceOf(AlarmEntry);
        expect(alarmEntry.type.value).toBe(type);
      });
    });

    it('should set createdAt and updatedAt to the same timestamp', () => {
      // Given: valid alarm entry properties
      const validName = 'Performance Issue';
      const validType = 'performance';

      const createProps: CreateAlarmEntryProps = {
        name: AlarmEntryName.from(validName),
        type: AlarmEntryType.from(validType),
      };

      // When: creating an AlarmEntry using the factory
      const alarmEntry = alarmEntryFactory.create(createProps);

      // Then: createdAt and updatedAt should be the same
      expect(alarmEntry.createdAt).toEqual(alarmEntry.updatedAt);
      expect(alarmEntry.createdAt).toBeInstanceOf(Date);
      expect(alarmEntry.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate unique ids for different alarm entries', () => {
      // Given: valid alarm entry properties
      const validName = 'Test Alarm Entry';
      const validType = 'system';

      const createProps: CreateAlarmEntryProps = {
        name: AlarmEntryName.from(validName),
        type: AlarmEntryType.from(validType),
      };

      // Setup mock to return different IDs for each call
      globalMocks.idProvider.generate.mockReturnValueOnce('id-1').mockReturnValueOnce('id-2');

      // When: creating multiple AlarmEntries using the factory
      const alarmEntry1 = alarmEntryFactory.create(createProps);
      const alarmEntry2 = alarmEntryFactory.create(createProps);

      // Then: they should have different ids
      expect(alarmEntry1.id.value).toBe('id-1');
      expect(alarmEntry2.id.value).toBe('id-2');
      expect(globalMocks.idProvider.generate).toHaveBeenCalledTimes(2);
    });

    it('should call id provider generate method', () => {
      // Given: valid alarm entry properties
      const validName = 'Network Timeout';
      const validType = 'network';

      const createProps: CreateAlarmEntryProps = {
        name: AlarmEntryName.from(validName),
        type: AlarmEntryType.from(validType),
      };

      // When: creating an AlarmEntry using the factory
      alarmEntryFactory.create(createProps);

      // Then: id provider generate should be called
      expect(globalMocks.idProvider.generate).toHaveBeenCalledTimes(1);
    });
  });
});
