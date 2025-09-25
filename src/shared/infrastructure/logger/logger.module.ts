import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SharedTokens } from '@/shared/infrastructure/ioc/tokens';
import { NestLogger } from '@/shared/infrastructure/logger/nestjs/nestjs-logger';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SharedTokens.Logger,
      useClass: NestLogger,
    },
  ],
  exports: [SharedTokens.Logger],
})
export class LoggerModule {}
