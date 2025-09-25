import pino, { Logger as Pino } from 'pino';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Logger } from '@/shared/application/contracts/logger.contract';
import { SharedConfiguration } from '@/shared/configuration/configuration';

@Injectable()
export class PinoLogger implements Logger {
  private pinoLogger: Pino;
  private context?: string;

  constructor(private readonly configService: ConfigService<SharedConfiguration>) {
    const nodeEnv = this.configService.get('application.environment');
    const isProduction = nodeEnv === 'production';

    this.pinoLogger = pino({
      level: nodeEnv === 'production' ? 'info' : 'debug',
      transport: isProduction
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
    });
  }

  debug(msg: string): void {
    this.pinoLogger.debug(this.formatMessage(msg));
  }

  log(msg: string): void {
    this.pinoLogger.info(this.formatMessage(msg));
  }

  warn(msg: string): void {
    this.pinoLogger.warn(this.formatMessage(msg));
  }

  error(msg: string | Error): void {
    if (msg instanceof Error) {
      this.pinoLogger.error({ err: msg, context: this.context }, this.formatMessage(msg.message));
    } else {
      this.pinoLogger.error(this.formatMessage(msg));
    }
  }

  fatal(msg: string | Error): void {
    if (msg instanceof Error) {
      this.pinoLogger.fatal({ err: msg, context: this.context }, this.formatMessage(msg.message));
    } else {
      this.pinoLogger.fatal(this.formatMessage(msg));
    }
  }

  setContext(context: string): void {
    this.context = context;
  }

  private formatMessage(msg: string): string {
    return this.context ? `[${this.context}] ${msg}` : msg;
  }

  getRawLogger(): Pino {
    return this.pinoLogger;
  }
}
