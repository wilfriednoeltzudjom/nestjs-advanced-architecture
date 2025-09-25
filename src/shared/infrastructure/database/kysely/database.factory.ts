import { Kysely, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Logger } from '@/shared/application/contracts/logger.contract';
import { SharedConfiguration } from '@/shared/configuration/configuration';
import { KyselyDatabase } from '@/shared/infrastructure/database/kysely/database.types';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

@Injectable()
export class KyselyDatabaseFactory implements OnModuleDestroy {
  private db: KyselyDatabase;
  private initializationPromise?: Promise<KyselyDatabase>;

  constructor(
    private readonly configService: ConfigService<SharedConfiguration>,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger.setContext(KyselyDatabaseFactory.name);
  }

  async create<T = any>(): Promise<KyselyDatabase<T>> {
    if (this.db) {
      return this.db as KyselyDatabase<T>;
    }

    if (this.initializationPromise) {
      return this.initializationPromise as Promise<KyselyDatabase<T>>;
    }

    this.initializationPromise = this.initializeClient();

    return this.initializationPromise as Promise<KyselyDatabase<T>>;
  }

  private async initializeClient(): Promise<KyselyDatabase> {
    this.logger.log('Initializing database client');
    const pool = new Pool({
      connectionString: this.configService.get('database.postgres.url'),
    });

    this.db = new Kysely({
      dialect: new PostgresDialect({
        pool,
      }),
    });

    try {
      await this.ensureConnection();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error('Database connection failed', error);
      throw error;
    }

    return this.db;
  }

  private async ensureConnection(): Promise<void> {
    if (this.db) {
      await this.db
        .selectNoFrom([])
        .select(sql<number>`1`.as('health'))
        .execute();
    } else {
      throw new Error('Database client not initialized');
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.db) {
      await this.db.destroy();
      this.logger.log('Database connection closed');
    }
  }
}
