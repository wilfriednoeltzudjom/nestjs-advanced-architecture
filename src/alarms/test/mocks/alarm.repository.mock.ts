import { vi } from 'vitest';

import { AlarmRepository } from '@/alarms/domain/contracts/repositories/alarm.repository';

export class MockAlarmRepository implements AlarmRepository {
  findAll = vi.fn();
  create = vi.fn();
  findByName = vi.fn();
}
