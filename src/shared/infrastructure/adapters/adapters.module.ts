import { Inject, Module, OnModuleInit } from '@nestjs/common';

import { UniqueIdentifier } from '@/shared/domain/base/unique-identifier.base';
import { IdProvider } from '@/shared/domain/contracts/id-provider.contract';
import { UuidProvider } from '@/shared/infrastructure/adapters/providers/uild.provider';
import { SharedTokens } from '@/shared/infrastructure/ioc/tokens';

@Module({
  providers: [
    {
      provide: SharedTokens.IdProvider,
      useClass: UuidProvider,
    },
  ],
  exports: [SharedTokens.IdProvider],
})
export class AdaptersModule implements OnModuleInit {
  constructor(@Inject(SharedTokens.IdProvider) private readonly idProvider: IdProvider) {}

  onModuleInit(): void {
    UniqueIdentifier.configureIdProvider(this.idProvider);
  }
}
