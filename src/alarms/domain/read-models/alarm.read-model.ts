import { AlarmEntryReadModel } from '@/alarms/domain/read-models/alarm-entry.read-model';

export interface AlarmReadModel {
  id: string;
  name: string;
  severity: string;
  triggeredAt: Date;
  isAcknowledged: boolean;
  createdAt: Date;
  updatedAt: Date;
  entries: AlarmEntryReadModel[];
}
