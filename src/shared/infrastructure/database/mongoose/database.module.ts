import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { mongooseConfig } from '@/shared/infrastructure/database/mongoose/database.config';
import { MongooseDatabaseService } from '@/shared/infrastructure/database/mongoose/database.service';
import { MongooseHealthCheckService } from '@/shared/infrastructure/database/mongoose/health-check.service';

@Module({
  imports: [MongooseModule.forRoot(mongooseConfig.uri, mongooseConfig.options)],
  providers: [MongooseDatabaseService, MongooseHealthCheckService],
  exports: [MongooseDatabaseService, MongooseHealthCheckService],
})
export class MongooseDatabaseModule {}
