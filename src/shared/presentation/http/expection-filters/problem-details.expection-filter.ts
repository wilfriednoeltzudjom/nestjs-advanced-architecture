import { Request, Response } from 'express';

import { applyDecorators, ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Injectable } from '@nestjs/common';
import { Abstract, Type } from '@nestjs/common/interfaces';

export function CatchExceptions(...exceptions: (Type | Abstract<any>)[]): ClassDecorator {
  return applyDecorators(Injectable(), Catch(...exceptions));
}

export type ProblemDetailsResponse = {
  statusCode: HttpStatus;
  message: string;
  errorCode?: string;
  errorParameters?: Record<string, any>;
};

export abstract class ProblemDetailsExceptionFilter<T = any> implements ExceptionFilter<T> {
  abstract map(exception: T): ProblemDetailsResponse;

  catch(exception: T, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const { statusCode, message, errorCode, errorParameters } = this.map(exception);

    response.status(statusCode).json({
      statusCode,
      errorCode,
      message,
      errorParameters,
      timestamp: new Date().toISOString(),
      path: request.path,
    });
  }
}
