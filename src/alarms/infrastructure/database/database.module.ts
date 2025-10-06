import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { KyselyAlarmRepository } from '@/alarms/infrastructure/database/kysely/alarms/alarm.repository';
import { KyselyAlarmEntryRepository } from '@/alarms/infrastructure/database/kysely/alarms/alarm-entry.repository';
import { AlarmsTables } from '@/alarms/infrastructure/database/kysely/db';
import { MongooseAlarmViewRepository } from '@/alarms/infrastructure/database/mongoose/alarms/alarm-view.repository';
import { AlarmView, AlarmViewSchema } from '@/alarms/infrastructure/database/mongoose/alarms/alarm-view.schema';
import { AlarmsTokens } from '@/alarms/infrastructure/ioc/tokens';
import { DomainDatabaseModule } from '@/shared/infrastructure/database/kysely/domain-database.module';

@Module({
  imports: [
    DomainDatabaseModule.forDomain<AlarmsTables>(AlarmsTokens.AlarmsDatabase),
    MongooseModule.forFeature([{ name: AlarmView.name, schema: AlarmViewSchema }]),
  ],
  providers: [
    {
      provide: AlarmsTokens.AlarmRepository,
      useClass: KyselyAlarmRepository,
    },
    {
      provide: AlarmsTokens.AlarmEntryRepository,
      useClass: KyselyAlarmEntryRepository,
    },
    {
      provide: AlarmsTokens.AlarmViewRepository,
      useClass: MongooseAlarmViewRepository,
    },
  ],
  exports: [AlarmsTokens.AlarmRepository, AlarmsTokens.AlarmEntryRepository, AlarmsTokens.AlarmViewRepository],
})
export class AlarmsDatabaseModule {}
