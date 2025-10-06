import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetAlarmsQuery } from '@/alarms/application/queries/get-alarms.query';
import { AlarmViewRepository } from '@/alarms/domain/contracts/repositories/alarm-view.repository';
import { AlarmReadModel } from '@/alarms/domain/read-models/alarm.read-model';
import { InjectAlarmViewRepository } from '@/alarms/infrastructure/database/database.decorators';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@QueryHandler(GetAlarmsQuery)
export class GetAlarmsQueryHandler implements IQueryHandler<GetAlarmsQuery> {
  constructor(
    @InjectAlarmViewRepository() private readonly alarmViewRepository: AlarmViewRepository,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(GetAlarmsQueryHandler.name);
  }

  async execute(query: GetAlarmsQuery): Promise<AlarmReadModel[]> {
    this.logger.debug('Getting alarms', query);

    return this.alarmViewRepository.findAll();
  }
}
