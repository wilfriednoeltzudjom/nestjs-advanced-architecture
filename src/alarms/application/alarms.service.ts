import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateAlarmCommand } from '@/alarms/application/commands/create-alarm.command';
import { GetAlarmsQuery } from '@/alarms/application/queries/get-alarms.query';
import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@Injectable()
export class AlarmsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(AlarmsService.name);
  }

  async create(createAlarmCommand: CreateAlarmCommand): Promise<Alarm> {
    return this.commandBus.execute(createAlarmCommand);
  }

  findAll(getAlarmsQuery: GetAlarmsQuery): Promise<Alarm[]> {
    return this.queryBus.execute(getAlarmsQuery);
  }
}
