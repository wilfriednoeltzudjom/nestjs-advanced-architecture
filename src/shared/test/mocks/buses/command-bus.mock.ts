import { vi } from 'vitest';

import { CommandBus, ICommand } from '@nestjs/cqrs';

export class MockCommandBus {
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

// Type assertion to make it compatible with CommandBus
export type MockCommandBusType = MockCommandBus & CommandBus<ICommand>;
