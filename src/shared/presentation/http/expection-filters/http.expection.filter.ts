import { HttpException } from '@nestjs/common';

import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';
import {
  CatchExceptions,
  ProblemDetailsExceptionFilter,
  ProblemDetailsResponse,
} from '@/shared/presentation/http/expection-filters/problem-details.expection-filter';

@CatchExceptions(HttpException)
export class HttpExceptionFilter extends ProblemDetailsExceptionFilter<HttpException> {
  constructor(@InjectLogger() private logger: Logger) {
    super();
    this.logger.setContext(HttpExceptionFilter.name);
  }

  map(exception: HttpException): ProblemDetailsResponse {
    const statusCode = exception.getStatus();
    this.logger.error(`Responding with HTTP status ${statusCode}`, exception);

    return {
      statusCode,
      errorCode: exception.cause as string,
      message: exception.message,
    };
  }
}
