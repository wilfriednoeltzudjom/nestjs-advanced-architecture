import { MockedFunction, vi } from 'vitest';

import { faker } from '@faker-js/faker';

import { IdProvider } from '@/shared/domain/contracts/id-provider.contract';

export class MockIdProvider implements IdProvider {
  generate: MockedFunction<() => string>;
  isValid: MockedFunction<() => boolean>;

  constructor() {
    this.generate = vi.fn();
    this.isValid = vi.fn();
  }

  resetDefaults(): void {
    this.generate.mockReturnValue(faker.string.ulid());
    this.isValid.mockReturnValue(true);
  }

  setupForInvalidId(): void {
    this.isValid.mockReturnValue(false);
  }

  setupForValidId(): void {
    this.isValid.mockReturnValue(true);
  }
}
