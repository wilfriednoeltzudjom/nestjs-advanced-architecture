import { afterEach, beforeEach, vi } from 'vitest';

import { faker } from '@faker-js/faker';

import { UniqueIdentifier } from '@/shared/domain/base/unique-identifier.base';
import { IdProvider } from '@/shared/domain/contracts/id-provider.contract';
import { MockCommandBus, MockCommandBusType } from '@/shared/test/mocks/buses/command-bus.mock';
import { MockQueryBus, MockQueryBusType } from '@/shared/test/mocks/buses/query-bus.mock';
import { MockIdProvider } from '@/shared/test/mocks/providers/id-provider.mock';

export const globalMocks = {
  idProvider: new MockIdProvider(),
  commandBus: new MockCommandBus() as MockCommandBusType,
  queryBus: new MockQueryBus() as MockQueryBusType,
};

/**
 * Global mocks for testing CQRS services
 *
 * Usage examples:
 *
 * // Setup command bus for success
 * globalMocks.commandBus.setupForSuccess(expectedResult);
 *
 * // Setup command bus for error
 * globalMocks.commandBus.setupForError(new Error('Something went wrong'));
 *
 * // Setup query bus for success
 * globalMocks.queryBus.setupForSuccess([item1, item2]);
 *
 * // Setup query bus for error
 * globalMocks.queryBus.setupForError(new Error('Query failed'));
 *
 * // Verify calls
 * expect(globalMocks.commandBus.execute).toHaveBeenCalledWith(command);
 * expect(globalMocks.queryBus.execute).toHaveBeenCalledWith(query);
 */

export const commonFixtures = {
  nullishValues: [null, undefined],
  currentDateTime: new Date('2025-01-01T00:00:00.000Z'),
  validId(): string {
    return faker.string.ulid({ refDate: commonFixtures.currentDateTime });
  },
  invalidId(): string {
    return faker.string.alphanumeric(10);
  },
};

export const testHelper = {
  configureIdProvider: (idProvider: IdProvider = globalMocks.idProvider) => {
    UniqueIdentifier.configureIdProvider(idProvider);
  },

  unconfigureIdProvider: () => {
    UniqueIdentifier.configureIdProvider(undefined as unknown as IdProvider);
  },

  mockSystemDateTime: (date: Date = commonFixtures.currentDateTime) => {
    vi.useFakeTimers();
    vi.setSystemTime(date);
  },

  unmockSystemDateTime: () => {
    vi.useRealTimers();
  },
};

beforeEach(() => {
  testHelper.configureIdProvider();
  globalMocks.idProvider.resetDefaults();
  globalMocks.commandBus.resetDefaults();
  globalMocks.queryBus.resetDefaults();
});

afterEach(() => {
  testHelper.unmockSystemDateTime();
  testHelper.unconfigureIdProvider();
});

global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};
