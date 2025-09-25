import { Injectable, Logger as Nest } from '@nestjs/common';

import { Logger } from '@/shared/application/contracts/logger.contract';

@Injectable()
export class NestLogger implements Logger {
  private nestLogger: Nest;
  private context?: string;

  constructor() {
    this.nestLogger = new Nest();
  }

  debug(msg: string, ...args: unknown[]): void {
    this.nestLogger.debug(this.formatMessage(msg), ...args);
  }

  log(msg: string, ...args: unknown[]): void {
    this.nestLogger.log(this.formatMessage(msg), ...args);
  }

  warn(msg: string, ...args: unknown[]): void {
    this.nestLogger.warn(this.formatMessage(msg), ...args);
  }

  error(msg: string | Error, ...args: unknown[]): void {
    if (msg instanceof Error) {
      this.nestLogger.error(this.formatMessage(msg.message), msg.stack, ...args);
    } else {
      this.nestLogger.error(this.formatMessage(msg), ...args);
    }
  }

  fatal(msg: string | Error, ...args: unknown[]): void {
    if (msg instanceof Error) {
      this.nestLogger.error(`FATAL: ${this.formatMessage(msg.message)}`, msg.stack, ...args);
    } else {
      this.nestLogger.error(`FATAL: ${this.formatMessage(msg)}`, ...args);
    }
  }

  setContext(context: string): void {
    this.context = context;
  }

  private formatMessage(msg: string): string {
    return this.context ? `[${this.context}] ${msg}` : msg;
  }

  getRawLogger(): Nest {
    return this.nestLogger;
  }
}
