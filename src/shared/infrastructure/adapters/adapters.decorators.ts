import { Inject } from '@nestjs/common';

import { SharedTokens } from '@/shared/infrastructure/ioc/tokens';

export const InjectIdProvider = () => Inject(SharedTokens.IdProvider);
