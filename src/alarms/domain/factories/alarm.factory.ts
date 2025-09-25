import { Injectable } from '@nestjs/common';

import { Alarm, AlarmProps } from '@/alarms/domain/entities/alarm.entity';
import { AlarmId } from '@/alarms/domain/value-objects/alarm-id.vo';
import { IdProvider } from '@/shared/domain/contracts/id-provider.contract';
import { InjectIdProvider } from '@/shared/infrastructure/adapters/adapters.decorators';

export type CreateAlarmProps = Omit<AlarmProps, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable()
export class AlarmFactory {
  constructor(@InjectIdProvider() private readonly idProvider: IdProvider) {}

  create({ name, severity }: CreateAlarmProps): Alarm {
    const id = AlarmId.from(this.idProvider.generate());
    const now = new Date();

    return Alarm.create({ id, name, severity, createdAt: now, updatedAt: now });
  }
}
