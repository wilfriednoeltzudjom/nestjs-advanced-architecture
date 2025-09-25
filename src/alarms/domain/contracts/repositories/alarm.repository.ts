import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';

export interface AlarmRepository {
  findAll(): Promise<Alarm[]>;
  create(alarm: Alarm): Promise<Alarm>;
  findByName(name: AlarmName): Promise<Alarm | null>;
}
