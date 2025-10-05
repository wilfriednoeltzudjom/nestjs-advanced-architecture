import { Injectable } from '@nestjs/common';

import { AlarmEntry, AlarmEntryProps } from '@/alarms/domain/entities/alarm-entry.entity';
import { AlarmEntryId } from '@/alarms/domain/value-objects/alarm-entry-id.vo';
import { IdProvider } from '@/shared/domain/contracts/id-provider.contract';
import { InjectIdProvider } from '@/shared/infrastructure/adapters/adapters.decorators';

export type CreateAlarmEntryProps = Omit<AlarmEntryProps, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable()
export class AlarmEntryFactory {
  constructor(@InjectIdProvider() private readonly idProvider: IdProvider) {}

  create({ name, type }: CreateAlarmEntryProps): AlarmEntry {
    const id = AlarmEntryId.from(this.idProvider.generate());
    const now = new Date();

    return AlarmEntry.create({ id, name, type, createdAt: now, updatedAt: now });
  }
}
