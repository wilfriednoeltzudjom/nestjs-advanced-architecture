import { Injectable } from '@nestjs/common';

import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmEntry } from '@/alarms/domain/entities/alarm-entry.entity';
import { AlarmId } from '@/alarms/domain/value-objects/alarm-id.vo';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity.vo';
import { IdProvider } from '@/shared/domain/contracts/id-provider.contract';
import { InjectIdProvider } from '@/shared/infrastructure/adapters/adapters.decorators';

export type CreateAlarmProps = {
  name: AlarmName;
  severity: AlarmSeverity;
  triggeredAt?: Date;
  isAcknowledged?: boolean;
  entries?: AlarmEntry[];
};

@Injectable()
export class AlarmFactory {
  constructor(@InjectIdProvider() private readonly idProvider: IdProvider) {}

  create({ name, severity, triggeredAt = new Date(), isAcknowledged = false, entries = [] }: CreateAlarmProps): Alarm {
    const id = AlarmId.from(this.idProvider.generate());
    const now = new Date();

    return Alarm.create({
      id,
      name,
      severity,
      triggeredAt,
      isAcknowledged,
      entries,
      createdAt: now,
      updatedAt: now,
    });
  }
}
