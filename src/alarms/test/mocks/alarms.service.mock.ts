import { vi } from 'vitest';

import { ConsoleLogger } from '@nestjs/common';

import { AlarmsService } from '@/alarms/application/alarms.service';
import { AlarmFactory } from '@/alarms/domain/factories/alarm.factory';
import { MockAlarmRepository } from '@/alarms/test/mocks/alarm.repository.mock';
import { globalMocks } from '@/shared/test/setup';

export class MockAlarmsService extends AlarmsService {
  constructor() {
    const alarmRepository = new MockAlarmRepository();
    const alarmFactory = new AlarmFactory(globalMocks.idProvider);
    super(alarmRepository, alarmFactory, new ConsoleLogger());
  }

  create = vi.fn();
  findAll = vi.fn();
}
