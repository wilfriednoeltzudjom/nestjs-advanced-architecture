import { Module } from '@nestjs/common';

import { KyselyDatabaseFactory } from '@/shared/infrastructure/database/kysely/database.factory';
import { KyselyHealthCheckService } from '@/shared/infrastructure/database/kysely/health-check.service';

@Module({
  providers: [KyselyDatabaseFactory, KyselyHealthCheckService],
  exports: [KyselyDatabaseFactory, KyselyHealthCheckService],
})
export class KyselyDatabaseModule {}
