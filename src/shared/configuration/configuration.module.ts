import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from '@/shared/configuration/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      load: [configuration],
    }),
  ],
})
export class SharedConfigurationModule {}
