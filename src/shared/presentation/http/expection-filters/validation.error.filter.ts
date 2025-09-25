import { HttpStatus } from '@nestjs/common';

import { ValidationError } from '@/shared/domain/errors/validation.error';

import {
  CatchExceptions,
  ProblemDetailsExceptionFilter,
  ProblemDetailsResponse,
} from './problem-details.expection-filter';

@CatchExceptions(ValidationError)
export class ValidationErrorFilter extends ProblemDetailsExceptionFilter<ValidationError> {
  map(exception: ValidationError): ProblemDetailsResponse {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      errorCode: exception.code,
      errorParameters: exception.parameters,
    };
  }
}
