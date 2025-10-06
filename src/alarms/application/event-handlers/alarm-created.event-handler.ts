import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AlarmViewRepository } from '@/alarms/domain/contracts/repositories/alarm-view.repository';
import { AlarmCreatedEvent } from '@/alarms/domain/events/alarm-created.event';
import { InjectAlarmViewRepository } from '@/alarms/infrastructure/database/database.decorators';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@EventsHandler(AlarmCreatedEvent)
export class AlarmCreatedEventHandler implements IEventHandler<AlarmCreatedEvent> {
  constructor(
    @InjectAlarmViewRepository() private readonly alarmViewRepository: AlarmViewRepository,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(AlarmCreatedEventHandler.name);
  }

  async handle(event: AlarmCreatedEvent): Promise<void> {
    await this.alarmViewRepository.upsert({
      id: event.alarm.id.value,
      name: event.alarm.name.value,
      severity: event.alarm.severity.value,
      triggeredAt: event.alarm.triggeredAt,
      isAcknowledged: event.alarm.isAcknowledged,
      entries: event.alarm.entries.map((entry) => ({
        id: entry.id.value,
        name: entry.name.value,
        type: entry.type.value,
      })),
    });
  }
}
