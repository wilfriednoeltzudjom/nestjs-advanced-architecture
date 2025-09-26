import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AlarmsModule } from '@/alarms/alarms.module';
import { SharedConfigurationModule } from '@/shared/configuration/configuration.module';
import { SharedInfrastructureModule } from '@/shared/infrastructure/infrastructure.module';
import { SharedPresentationModule } from '@/shared/presentation/presentation.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    SharedConfigurationModule,
    SharedInfrastructureModule,
    SharedPresentationModule,
    AlarmsModule,
  ],
})
export class AppModule {}
