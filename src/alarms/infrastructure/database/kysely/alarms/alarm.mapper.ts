import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmTable } from '@/alarms/infrastructure/database/kysely/alarms/alarm.table';

export class AlarmMapper {
  static forDomain(alarm: AlarmTable): Alarm {
    return Alarm.hydrate({
      id: alarm.id,
      name: alarm.name,
      severity: alarm.severity,
      triggeredAt: alarm.triggered_at,
      isAcknowledged: alarm.is_acknowledged,
      entries: [], // Entries will be loaded separately and merged
      createdAt: alarm.created_at,
      updatedAt: alarm.updated_at,
    });
  }

  static forDatabase(alarm: Alarm): AlarmTable {
    return {
      id: alarm.id.value,
      name: alarm.name.value,
      severity: alarm.severity.value,
      triggered_at: alarm.triggeredAt,
      is_acknowledged: alarm.isAcknowledged,
      created_at: alarm.createdAt,
      updated_at: alarm.updatedAt,
    };
  }
}
