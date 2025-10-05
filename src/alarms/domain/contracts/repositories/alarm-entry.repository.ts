import { AlarmEntry } from '@/alarms/domain/entities/alarm-entry.entity';

export interface AlarmEntryRepository {
  /**
   * Find all alarm entries for a specific alarm
   */
  findByAlarmId(alarmId: string): Promise<AlarmEntry[]>;

  /**
   * Create multiple alarm entries for an alarm
   */
  createMany(entries: AlarmEntry[], alarmId: string): Promise<AlarmEntry[]>;

  /**
   * Delete all alarm entries for a specific alarm
   */
  deleteByAlarmId(alarmId: string): Promise<void>;

  /**
   * Find all alarm entries for multiple alarms (batch operation)
   */
  findByAlarmIds(alarmIds: string[]): Promise<Map<string, AlarmEntry[]>>;
}
