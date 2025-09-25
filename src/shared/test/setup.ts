import { afterEach, beforeEach, vi } from 'vitest';

import { faker } from '@faker-js/faker';

import { UniqueIdentifier } from '@/shared/domain/base/unique-identifier.base';
import { IdProvider } from '@/shared/domain/contracts/id-provider.contract';
import { MockIdProvider } from '@/shared/test/mocks/providers/id-provider.mock';

export const globalMocks = {
  idProvider: new MockIdProvider(),
};

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
