import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { CreateAlarmCommand } from '@/alarms/application/commands/create-alarm.command';
import { AlarmAlreadyExistsError } from '@/alarms/application/errors/alarm-already-exits.error';
import { AlarmRepository } from '@/alarms/domain/contracts/repositories/alarm.repository';
import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmCreatedEvent } from '@/alarms/domain/events/alarm-created.event';
import { AlarmFactory, CreateAlarmProps } from '@/alarms/domain/factories/alarm.factory';
import { AlarmEntryFactory } from '@/alarms/domain/factories/alarm-entry.factory';
import { AlarmEntryName } from '@/alarms/domain/value-objects/alarm-entry-name.vo';
import { AlarmEntryType } from '@/alarms/domain/value-objects/alarm-entry-type.vo';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity.vo';
import { InjectAlarmRepository } from '@/alarms/infrastructure/database/database.decorators';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler implements ICommandHandler<CreateAlarmCommand> {
  constructor(
    private readonly alarmFactory: AlarmFactory,
    private readonly alarmEntryFactory: AlarmEntryFactory,
    @InjectAlarmRepository() private readonly alarmRepository: AlarmRepository,
    @InjectLogger() private readonly logger: Logger,
    private readonly eventBus: EventBus,
  ) {
    this.logger.setContext(CreateAlarmCommandHandler.name);
  }

  async execute(createAlarmCommand: CreateAlarmCommand): Promise<Alarm> {
    this.logger.debug('Processing "CreateAlarmCommand"', createAlarmCommand);

    const createAlarmProps: CreateAlarmProps = {
      name: AlarmName.from(createAlarmCommand.name),
      severity: AlarmSeverity.from(createAlarmCommand.severity),
      triggeredAt: createAlarmCommand.triggeredAt,
      entries: createAlarmCommand.entries?.map((entry) =>
        this.alarmEntryFactory.create({ name: AlarmEntryName.from(entry.name), type: AlarmEntryType.from(entry.type) }),
      ),
    };

    const existingAlarm = await this.alarmRepository.findByName(createAlarmProps.name);
    if (existingAlarm) {
      throw new AlarmAlreadyExistsError();
    }

    const alarm = this.alarmFactory.create(createAlarmProps);
    const persistedAlarm = await this.alarmRepository.create(alarm);

    // Dispatch event
    await this.eventBus.publish(new AlarmCreatedEvent(persistedAlarm));

    return persistedAlarm;
  }
}
