import { Connection, ConnectionStates } from 'mongoose';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@Injectable()
export class MongooseDatabaseService implements OnModuleInit {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(MongooseDatabaseService.name);
  }

  onModuleInit(): void {
    // Set up connection event listeners
    this.connection.on('connected', () => {
      this.logger.log('MongoDB connected successfully');
    });

    this.connection.on('error', (error) => {
      this.logger.error('MongoDB connection error:', error);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('MongoDB disconnected');
    });

    this.connection.on('reconnected', () => {
      this.logger.log('MongoDB reconnected');
    });

    // Log connection info
    this.logger.log(`MongoDB connection state: ${this.connection.readyState}`);
  }

  /**
   * Get the MongoDB connection
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Check if the connection is ready
   */
  isConnected(): boolean {
    return this.connection.readyState === ConnectionStates.connected;
  }

  /**
   * Get connection statistics
   */
  getConnectionStats() {
    return {
      readyState: this.connection.readyState,
      host: this.connection.host,
      port: this.connection.port,
      name: this.connection.name,
    };
  }
}
