import { AlarmRepository } from '@/alarms/domain/contracts/repositories/alarm.repository';
import { AlarmEntryRepository } from '@/alarms/domain/contracts/repositories/alarm-entry.repository';
import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { InjectAlarmEntryRepository, InjectAlarmsDatabase } from '@/alarms/infrastructure/database/database.decorators';
import { AlarmMapper } from '@/alarms/infrastructure/database/kysely/alarms/alarm.mapper';
import { AlarmEntryMapper } from '@/alarms/infrastructure/database/kysely/alarms/alarm-entry.mapper';
import { AlarmsDatabase } from '@/alarms/infrastructure/database/kysely/db';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

export class KyselyAlarmRepository implements AlarmRepository {
  private readonly tableName = 'alarms';

  constructor(
    @InjectAlarmsDatabase() private readonly db: AlarmsDatabase,
    @InjectAlarmEntryRepository() private readonly alarmEntryRepository: AlarmEntryRepository,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(KyselyAlarmRepository.name);
  }

  async findAll(): Promise<Alarm[]> {
    const alarms = await this.db.selectFrom(this.tableName).selectAll().execute();

    if (alarms.length === 0) {
      return [];
    }

    // Use AlarmEntryRepository to load all entries efficiently
    const alarmIds = alarms.map((alarm) => alarm.id);
    const entriesByAlarmId = await this.alarmEntryRepository.findByAlarmIds(alarmIds);

    // Create alarms with their entries
    return alarms.map((alarm) => {
      const alarmEntity = AlarmMapper.forDomain(alarm);
      const alarmEntries = entriesByAlarmId.get(alarm.id) || [];

      return Alarm.hydrate({
        ...alarmEntity.toPrimitives(),
        entries: alarmEntries.map((entry) => entry.toPrimitives()),
      });
    });
  }

  async create(alarm: Alarm): Promise<Alarm> {
    return this.db.transaction().execute(async (trx) => {
      // Insert the alarm
      const alarmResult = await trx
        .insertInto(this.tableName)
        .values(AlarmMapper.forDatabase(alarm))
        .returningAll()
        .execute();

      const createdAlarm = alarmResult[0];

      // Insert alarm entries if any
      if (alarm.entries.length > 0) {
        const entryData = alarm.entries.map((entry) => AlarmEntryMapper.forDatabase(entry, createdAlarm.id));
        await trx.insertInto('alarm_entries').values(entryData).execute();
      }

      // Return the alarm with entries loaded from the repository
      // Note: We'll load entries after the transaction commits to ensure consistency
      const alarmEntity = AlarmMapper.forDomain(createdAlarm);
      const entries = await this.alarmEntryRepository.findByAlarmId(createdAlarm.id);

      return Alarm.hydrate({
        ...alarmEntity.toPrimitives(),
        entries: entries.map((entry) => entry.toPrimitives()),
      });
    });
  }

  async findByName(name: AlarmName): Promise<Alarm | null> {
    const alarms = await this.db.selectFrom(this.tableName).where('name', '=', name.value).selectAll().execute();

    if (alarms.length === 0) {
      return null;
    }

    const alarm = alarms[0];

    // Use AlarmEntryRepository to load entries
    const entries = await this.alarmEntryRepository.findByAlarmId(alarm.id);

    const alarmEntity = AlarmMapper.forDomain(alarm);

    return Alarm.hydrate({
      ...alarmEntity.toPrimitives(),
      entries: entries.map((entry) => entry.toPrimitives()),
    });
  }
}
