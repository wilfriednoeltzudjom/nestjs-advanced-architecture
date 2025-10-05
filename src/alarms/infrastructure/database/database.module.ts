import { Module } from '@nestjs/common';

import { KyselyAlarmRepository } from '@/alarms/infrastructure/database/kysely/alarms/alarm.repository';
import { KyselyAlarmEntryRepository } from '@/alarms/infrastructure/database/kysely/alarms/alarm-entry.repository';
import { AlarmsTables } from '@/alarms/infrastructure/database/kysely/db';
import { AlarmsTokens } from '@/alarms/infrastructure/ioc/tokens';
import { DomainDatabaseModule } from '@/shared/infrastructure/database/kysely/domain-database.module';

@Module({
  imports: [DomainDatabaseModule.forDomain<AlarmsTables>(AlarmsTokens.AlarmsDatabase)],
  providers: [
    {
      provide: AlarmsTokens.AlarmRepository,
      useClass: KyselyAlarmRepository,
    },
    {
      provide: AlarmsTokens.AlarmEntryRepository,
      useClass: KyselyAlarmEntryRepository,
    },
  ],
  exports: [AlarmsTokens.AlarmRepository, AlarmsTokens.AlarmEntryRepository],
})
export class AlarmsDatabaseModule {}
