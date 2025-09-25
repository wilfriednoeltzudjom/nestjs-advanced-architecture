import { Injectable } from '@nestjs/common';

import { CreateAlarmCommand } from '@/alarms/application/commands/create-alarm.command';
import { AlarmAlreadyExistsError } from '@/alarms/application/errors/alarm-already-exits.error';
import { AlarmRepository } from '@/alarms/domain/contracts/repositories/alarm.repository';
import { AlarmFactory } from '@/alarms/domain/factories/alarm.factory';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity.vo';
import { InjectAlarmRepository } from '@/alarms/infrastructure/database/database.decorators';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@Injectable()
export class AlarmsService {
  constructor(
    @InjectAlarmRepository() private readonly alarmRepository: AlarmRepository,
    private readonly alarmFactory: AlarmFactory,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(AlarmsService.name);
  }

  async create(createAlarmCommand: CreateAlarmCommand) {
    const name = AlarmName.from(createAlarmCommand.name);
    const severity = AlarmSeverity.from(createAlarmCommand.severity);

    const existingAlarm = await this.alarmRepository.findByName(name);
    if (existingAlarm) {
      throw new AlarmAlreadyExistsError();
    }

    const alarm = this.alarmFactory.create({ name, severity });

    return this.alarmRepository.create(alarm);
  }

  findAll() {
    return this.alarmRepository.findAll();
  }
}
