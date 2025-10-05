import { Connection, ConnectionStates } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

export interface DatabaseHealthStatus {
  status: 'healthy' | 'unhealthy';
  connectionState: number;
  connectionStateText: string;
  host?: string;
  port?: number;
  name?: string;
  error?: string;
}

@Injectable()
export class MongooseHealthCheckService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(MongooseHealthCheckService.name);
  }

  checkHealth(): DatabaseHealthStatus {
    try {
      const state = this.connection.readyState;
      const stateText = this.getConnectionStateText(state);

      if (state === ConnectionStates.connected) {
        // Connection is open and ready
        return {
          status: 'healthy',
          connectionState: state,
          connectionStateText: stateText,
          host: this.connection.host,
          port: this.connection.port,
          name: this.connection.name,
        };
      } else {
        return {
          status: 'unhealthy',
          connectionState: state,
          connectionStateText: stateText,
          host: this.connection.host,
          port: this.connection.port,
          name: this.connection.name,
        };
      }
    } catch (error) {
      this.logger.error('MongoDB health check failed:', error);
      return {
        status: 'unhealthy',
        connectionState: 0,
        connectionStateText: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getConnectionStateText(state: number): string {
    switch (state) {
      case 0:
        return 'disconnected';
      case 1:
        return 'connected';
      case 2:
        return 'connecting';
      case 3:
        return 'disconnecting';
      default:
        return 'unknown';
    }
  }
}
