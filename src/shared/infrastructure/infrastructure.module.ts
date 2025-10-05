import { Global, Module } from '@nestjs/common';

import { AdaptersModule } from '@/shared/infrastructure/adapters/adapters.module';
import { MongooseDatabaseModule } from '@/shared/infrastructure/database/mongoose/database.module';
import { LoggerModule } from '@/shared/infrastructure/logger/logger.module';

@Global()
@Module({
  imports: [AdaptersModule, LoggerModule, MongooseDatabaseModule],
  exports: [AdaptersModule, LoggerModule, MongooseDatabaseModule],
})
export class SharedInfrastructureModule {}
