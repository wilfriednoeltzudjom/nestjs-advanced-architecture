import { HttpStatus } from '@nestjs/common';

import { ResourceAlreadyExistsError } from '@/shared/application/errors/resource-already-exists.error';

import { CatchExceptions, ProblemDetailsExceptionFilter } from './problem-details.expection-filter';
import { ProblemDetailsResponse } from './problem-details.expection-filter';

@CatchExceptions(ResourceAlreadyExistsError)
export class ResourceAlreadyExistsErrorFilter extends ProblemDetailsExceptionFilter<ResourceAlreadyExistsError> {
  map(exception: ResourceAlreadyExistsError): ProblemDetailsResponse {
    return {
      statusCode: HttpStatus.CONFLICT,
      message: exception.message,
      errorCode: exception.code,
      errorParameters: exception.parameters,
    };
  }
}
