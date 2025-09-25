import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmTable } from '@/alarms/infrastructure/database/kysely/alarms/alarm.table';

export class AlarmMapper {
  static forDomain(alarm: AlarmTable): Alarm {
    return Alarm.hydrate({
      id: alarm.id,
      name: alarm.name,
      severity: alarm.severity,
      createdAt: alarm.created_at,
      updatedAt: alarm.updated_at,
    });
  }

  static forDatabase(alarm: Alarm): AlarmTable {
    return {
      id: alarm.id.value,
      name: alarm.name.value,
      severity: alarm.severity.value,
      created_at: alarm.createdAt,
      updated_at: alarm.updatedAt,
    };
  }
}
