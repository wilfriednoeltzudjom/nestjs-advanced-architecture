import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { CreateAlarmCommand } from '@/alarms/application/commands/create-alarm.command';
import { AlarmAlreadyExistsError } from '@/alarms/application/errors/alarm-already-exits.error';
import { AlarmRepository } from '@/alarms/domain/contracts/repositories/alarm.repository';
import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmCreatedEvent } from '@/alarms/domain/events/alarm-created.event';
import { AlarmFactory } from '@/alarms/domain/factories/alarm.factory';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity.vo';
import { InjectAlarmRepository } from '@/alarms/infrastructure/database/database.decorators';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler implements ICommandHandler<CreateAlarmCommand> {
  constructor(
    private readonly alarmFactory: AlarmFactory,
    @InjectAlarmRepository() private readonly alarmRepository: AlarmRepository,
    @InjectLogger() private readonly logger: Logger,
    private readonly eventBus: EventBus,
  ) {
    this.logger.setContext(CreateAlarmCommandHandler.name);
  }

  async execute(createAlarmCommand: CreateAlarmCommand): Promise<Alarm> {
    this.logger.debug('Processing "CreateAlarmCommand"', createAlarmCommand);

    const name = AlarmName.from(createAlarmCommand.name);
    const severity = AlarmSeverity.from(createAlarmCommand.severity);

    const existingAlarm = await this.alarmRepository.findByName(name);
    if (existingAlarm) {
      throw new AlarmAlreadyExistsError();
    }

    const alarm = this.alarmFactory.create({ name, severity });
    const persistedAlarm = await this.alarmRepository.create(alarm);

    // Dispatch event
    await this.eventBus.publish(new AlarmCreatedEvent(persistedAlarm));

    return persistedAlarm;
  }
}
