import { Module } from '@nestjs/common';

import { KyselyDatabaseFactory } from '@/shared/infrastructure/database/kysely/database.factory';

@Module({
  providers: [KyselyDatabaseFactory],
  exports: [KyselyDatabaseFactory],
})
export class KyselyDatabaseModule {}
