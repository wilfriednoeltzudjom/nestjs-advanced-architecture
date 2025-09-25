import { HttpStatus } from '@nestjs/common';

import { FatalError } from '@/shared/domain/errors/fatal.error';

import { CatchExceptions, ProblemDetailsExceptionFilter } from './problem-details.expection-filter';
import { ProblemDetailsResponse } from './problem-details.expection-filter';

@CatchExceptions(FatalError)
export class FatalErrorFilter extends ProblemDetailsExceptionFilter<FatalError> {
  map(exception: FatalError): ProblemDetailsResponse {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
      errorCode: exception.code,
      errorParameters: exception.parameters,
    };
  }
}
