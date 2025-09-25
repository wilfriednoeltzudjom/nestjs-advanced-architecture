import { Global, Module } from '@nestjs/common';

import { AdaptersModule } from '@/shared/infrastructure/adapters/adapters.module';
import { LoggerModule } from '@/shared/infrastructure/logger/logger.module';

@Global()
@Module({
  imports: [AdaptersModule, LoggerModule],
  exports: [AdaptersModule, LoggerModule],
})
export class SharedInfrastructureModule {}
