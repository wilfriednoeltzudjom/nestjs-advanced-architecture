import { AlarmEntryRepository } from '@/alarms/domain/contracts/repositories/alarm-entry.repository';
import { AlarmEntry } from '@/alarms/domain/entities/alarm-entry.entity';
import { InjectAlarmsDatabase } from '@/alarms/infrastructure/database/database.decorators';
import { AlarmEntryMapper } from '@/alarms/infrastructure/database/kysely/alarms/alarm-entry.mapper';
import { AlarmsDatabase } from '@/alarms/infrastructure/database/kysely/db';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

export class KyselyAlarmEntryRepository implements AlarmEntryRepository {
  private readonly tableName = 'alarm_entries';

  constructor(
    @InjectAlarmsDatabase() private readonly db: AlarmsDatabase,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(KyselyAlarmEntryRepository.name);
  }

  async findByAlarmId(alarmId: string): Promise<AlarmEntry[]> {
    const entries = await this.db.selectFrom(this.tableName).selectAll().where('alarm_id', '=', alarmId).execute();

    return entries.map((entry) => AlarmEntryMapper.forDomain(entry));
  }

  async createMany(entries: AlarmEntry[], alarmId: string): Promise<AlarmEntry[]> {
    if (entries.length === 0) {
      return [];
    }

    const entryData = entries.map((entry) => AlarmEntryMapper.forDatabase(entry, alarmId));

    const createdEntries = await this.db.insertInto(this.tableName).values(entryData).returningAll().execute();

    return createdEntries.map((entry) => AlarmEntryMapper.forDomain(entry));
  }

  async deleteByAlarmId(alarmId: string): Promise<void> {
    await this.db.deleteFrom(this.tableName).where('alarm_id', '=', alarmId).execute();
  }

  async findByAlarmIds(alarmIds: string[]): Promise<Map<string, AlarmEntry[]>> {
    if (alarmIds.length === 0) {
      return new Map();
    }

    const entries = await this.db.selectFrom(this.tableName).selectAll().where('alarm_id', 'in', alarmIds).execute();

    // Group entries by alarm_id
    const entriesByAlarmId = new Map<string, AlarmEntry[]>();

    for (const entry of entries) {
      const alarmId = entry.alarm_id;
      if (!entriesByAlarmId.has(alarmId)) {
        entriesByAlarmId.set(alarmId, []);
      }
      entriesByAlarmId.get(alarmId)!.push(AlarmEntryMapper.forDomain(entry));
    }

    return entriesByAlarmId;
  }
}
