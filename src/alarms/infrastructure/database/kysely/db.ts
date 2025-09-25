import { Kysely } from 'kysely';

import { AlarmTable } from '@/alarms/infrastructure/database/kysely/alarms/alarm.table';

export type AlarmsTables = {
  alarms: AlarmTable;
};

export class AlarmsDatabase extends Kysely<AlarmsTables> {}
