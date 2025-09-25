import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { FatalErrorFilter } from '@/shared/presentation/http/expection-filters/fatal.error.filter';
import { HttpExceptionFilter } from '@/shared/presentation/http/expection-filters/http.expection.filter';
import { ResourceAlreadyExistsErrorFilter } from '@/shared/presentation/http/expection-filters/resource-already-exists.error.filter';
import { ValidationErrorFilter } from '@/shared/presentation/http/expection-filters/validation.error.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FatalErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ResourceAlreadyExistsErrorFilter,
    },
  ],
})
export class HttpModule {}
