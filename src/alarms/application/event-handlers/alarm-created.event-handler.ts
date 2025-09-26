import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AlarmCreatedEvent } from '@/alarms/domain/events/alarm-created.event';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@EventsHandler(AlarmCreatedEvent)
export class AlarmCreatedEventHandler implements IEventHandler<AlarmCreatedEvent> {
  constructor(@InjectLogger() private readonly logger: Logger) {
    this.logger.setContext(AlarmCreatedEventHandler.name);
  }

  async handle(event: AlarmCreatedEvent): Promise<void> {
    this.logger.debug('Alarm created event received', event.alarm);
    await Promise.resolve();
  }
}
