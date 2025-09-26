import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetAlarmsQuery } from '@/alarms/application/queries/get-alarms.query';
import { AlarmRepository } from '@/alarms/domain/contracts/repositories/alarm.repository';
import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { InjectAlarmRepository } from '@/alarms/infrastructure/database/database.decorators';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@QueryHandler(GetAlarmsQuery)
export class GetAlarmsQueryHandler implements IQueryHandler<GetAlarmsQuery> {
  constructor(
    @InjectAlarmRepository() private readonly alarmRepository: AlarmRepository,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(GetAlarmsQueryHandler.name);
  }

  async execute(query: GetAlarmsQuery): Promise<Alarm[]> {
    this.logger.debug('Getting alarms', query);

    return this.alarmRepository.findAll();
  }
}
