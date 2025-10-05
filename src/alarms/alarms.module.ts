import { Module } from '@nestjs/common';

import { AlarmsService } from '@/alarms/application/alarms.service';
import { CreateAlarmCommandHandler } from '@/alarms/application/commands/create-alarm.command-handler';
import { AlarmCreatedEventHandler } from '@/alarms/application/event-handlers/alarm-created.event-handler';
import { GetAlarmsQueryHandler } from '@/alarms/application/queries/get-alarms.query-handler';
import { AlarmFactory } from '@/alarms/domain/factories/alarm.factory';
import { AlarmEntryFactory } from '@/alarms/domain/factories/alarm-entry.factory';
import { AlarmsDatabaseModule } from '@/alarms/infrastructure/database/database.module';
import { AlarmsController } from '@/alarms/presentation/http/controllers/alarms.controller';

const eventHandlers = [AlarmCreatedEventHandler];
const commandHandlers = [CreateAlarmCommandHandler];
const queryHandlers = [GetAlarmsQueryHandler];
const handlers = [...eventHandlers, ...commandHandlers, ...queryHandlers];

@Module({
  imports: [AlarmsDatabaseModule],
  controllers: [AlarmsController],
  providers: [AlarmFactory, AlarmEntryFactory, AlarmsService, ...handlers],
})
export class AlarmsModule {}
