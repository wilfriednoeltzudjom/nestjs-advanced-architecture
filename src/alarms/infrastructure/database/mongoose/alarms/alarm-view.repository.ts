import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

import { AlarmViewRepository } from '@/alarms/domain/contracts/repositories/alarm-view.repository';
import { AlarmReadModel } from '@/alarms/domain/read-models/alarm.read-model';
import { AlarmViewMapper } from '@/alarms/infrastructure/database/mongoose/alarms/alarm-view.mapper';
import { AlarmView } from '@/alarms/infrastructure/database/mongoose/alarms/alarm-view.schema';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

export class MongooseAlarmViewRepository implements AlarmViewRepository {
  constructor(
    @InjectModel(AlarmView.name) private readonly alarmViewModel: Model<AlarmView>,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(MongooseAlarmViewRepository.name);
  }

  async findAll(): Promise<AlarmReadModel[]> {
    const alarmViews = await this.alarmViewModel.find().exec();

    return alarmViews.map((alarmView) => AlarmViewMapper.forDomain(alarmView));
  }

  async upsert(alarm: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>): Promise<void> {
    await this.alarmViewModel.updateOne({ id: alarm.id }, { $set: alarm }, { upsert: true });
  }
}
