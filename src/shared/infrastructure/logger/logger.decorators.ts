import { Inject } from '@nestjs/common';

import { SharedTokens } from '@/shared/infrastructure/ioc/tokens';

export const InjectLogger = () => Inject(SharedTokens.Logger);
