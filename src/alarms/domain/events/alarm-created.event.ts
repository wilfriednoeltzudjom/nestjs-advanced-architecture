import { Alarm } from '@/alarms/domain/entities/alarm.entity';

export class AlarmCreatedEvent {
  constructor(public readonly alarm: Alarm) {}
}
