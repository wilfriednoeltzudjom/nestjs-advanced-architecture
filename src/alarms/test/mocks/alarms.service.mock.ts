import { vi } from 'vitest';

import { ConsoleLogger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { AlarmsService } from '@/alarms/application/alarms.service';

export class MockAlarmsService extends AlarmsService {
  constructor() {
    super({ execute: vi.fn() } as any as CommandBus, { execute: vi.fn() } as any as QueryBus, new ConsoleLogger());
  }

  create = vi.fn();
  findAll = vi.fn();
}
