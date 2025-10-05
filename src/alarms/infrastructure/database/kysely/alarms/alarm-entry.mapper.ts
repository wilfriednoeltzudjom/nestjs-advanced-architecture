import { AlarmEntry } from '@/alarms/domain/entities/alarm-entry.entity';
import { AlarmEntryTable } from '@/alarms/infrastructure/database/kysely/alarms/alarm-entry.table';

export class AlarmEntryMapper {
  static forDomain(alarmEntry: AlarmEntryTable): AlarmEntry {
    return AlarmEntry.hydrate({
      id: alarmEntry.id,
      name: alarmEntry.name,
      type: alarmEntry.type,
      createdAt: alarmEntry.created_at,
      updatedAt: alarmEntry.updated_at,
    });
  }

  static forDatabase(alarmEntry: AlarmEntry, alarmId: string): AlarmEntryTable {
    return {
      id: alarmEntry.id.value,
      alarm_id: alarmId,
      name: alarmEntry.name.value,
      type: alarmEntry.type.value,
      created_at: alarmEntry.createdAt,
      updated_at: alarmEntry.updatedAt,
    };
  }
}
