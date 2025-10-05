import { Inject } from '@nestjs/common';

import { AlarmsTokens } from '@/alarms/infrastructure/ioc/tokens';

export const InjectAlarmsDatabase = () => Inject(AlarmsTokens.AlarmsDatabase);
export const InjectAlarmRepository = () => Inject(AlarmsTokens.AlarmRepository);
export const InjectAlarmEntryRepository = () => Inject(AlarmsTokens.AlarmEntryRepository);
