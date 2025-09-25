import { Module } from '@nestjs/common';

import { HttpModule } from '@/shared/presentation/http/http.module';

@Module({
  imports: [HttpModule],
})
export class SharedPresentationModule {}
