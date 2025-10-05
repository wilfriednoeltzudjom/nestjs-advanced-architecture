import { vi } from 'vitest';

import { IQuery, QueryBus } from '@nestjs/cqrs';

export class MockQueryBus {
  execute = vi.fn();

  resetDefaults(): void {
    this.execute.mockReset();
  }

  setupForSuccess<T>(returnValue: T): void {
    this.execute.mockResolvedValue(returnValue);
  }

  setupForError(error: Error): void {
    this.execute.mockRejectedValue(error);
  }
}

// Type assertion to make it compatible with QueryBus
export type MockQueryBusType = MockQueryBus & QueryBus<IQuery>;
