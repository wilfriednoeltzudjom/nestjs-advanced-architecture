import { Module } from '@nestjs/common';

import { AlarmsService } from '@/alarms/application/alarms.service';
import { AlarmFactory } from '@/alarms/domain/factories/alarm.factory';
import { AlarmsDatabaseModule } from '@/alarms/infrastructure/database/database.module';
import { AlarmsController } from '@/alarms/presentation/http/controllers/alarms.controller';

@Module({
  imports: [AlarmsDatabaseModule],
  controllers: [AlarmsController],
  providers: [AlarmFactory, AlarmsService],
})
export class AlarmsModule {}
