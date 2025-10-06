import { AlarmReadModel } from '@/alarms/domain/read-models/alarm.read-model';
import { AlarmView } from '@/alarms/infrastructure/database/mongoose/alarms/alarm-view.schema';

export class AlarmViewMapper {
  static forDomain(alarmView: AlarmView): AlarmReadModel {
    return {
      id: alarmView.id,
      name: alarmView.name,
      severity: alarmView.severity,
      triggeredAt: alarmView.triggeredAt,
      isAcknowledged: alarmView.isAcknowledged,
      entries: alarmView.entries.map((entry) => ({
        id: entry.id,
        name: entry.name,
        type: entry.type,
      })),
      createdAt: alarmView.createdAt,
      updatedAt: alarmView.updatedAt,
    };
  }
}
