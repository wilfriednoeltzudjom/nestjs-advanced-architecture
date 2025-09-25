import { DynamicModule } from '@nestjs/common';

import { KyselyDatabaseFactory } from '@/shared/infrastructure/database/kysely/database.factory';
import { KyselyDatabaseModule } from '@/shared/infrastructure/database/kysely/database.module';

export class DomainDatabaseModule {
  static forDomain<T>(key: symbol): DynamicModule {
    return {
      module: DomainDatabaseModule,
      imports: [KyselyDatabaseModule],
      providers: [
        {
          provide: key,
          useFactory: (kyselyDatabaseFactory: KyselyDatabaseFactory) => {
            return kyselyDatabaseFactory.create<T>();
          },
          inject: [KyselyDatabaseFactory],
        },
      ],
      exports: [key],
    };
  }
}
