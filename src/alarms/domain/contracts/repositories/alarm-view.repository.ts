import { AlarmReadModel } from '@/alarms/domain/read-models/alarm.read-model';

export interface AlarmViewRepository {
  findAll(): Promise<AlarmReadModel[]>;
  upsert(alarm: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>): Promise<void>;
}
