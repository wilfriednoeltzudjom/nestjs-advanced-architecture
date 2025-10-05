import { Kysely } from 'kysely';

import { AlarmTable } from '@/alarms/infrastructure/database/kysely/alarms/alarm.table';
import { AlarmEntryTable } from '@/alarms/infrastructure/database/kysely/alarms/alarm-entry.table';

export type AlarmsTables = {
  alarms: AlarmTable;
  alarm_entries: AlarmEntryTable;
};

export class AlarmsDatabase extends Kysely<AlarmsTables> {}
