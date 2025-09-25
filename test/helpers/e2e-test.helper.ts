import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { resolve } from 'path';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AlarmRepository } from '@/alarms/domain/contracts/repositories/alarm.repository';
import { AlarmsTokens } from '@/alarms/infrastructure/ioc/tokens';
import { AlarmSeeder } from '@/alarms/test/fixtures/seeders/alarm.seeder';
import { KyselyDatabaseFactory } from '@/shared/infrastructure/database/kysely/database.factory';
import { KyselyDatabase } from '@/shared/infrastructure/database/kysely/database.types';

import { AppModule } from '../../src/app.module';

export class E2ETestHelper {
  private app: INestApplication;
  private module: TestingModule;
  private databaseFactory: KyselyDatabaseFactory;
  private db: KyselyDatabase;
  private alarmSeeder: AlarmSeeder;

  async setup(): Promise<INestApplication> {
    // Load environment variables from .env file
    const expandedConfig = config({ path: resolve(__dirname, '../testcontainers/.env'), override: true });
    dotenvExpand.expand(expandedConfig);

    this.module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = this.module.createNestApplication();
    await this.app.init();

    // Get database for cleanup
    this.databaseFactory = this.module.get<KyselyDatabaseFactory>(KyselyDatabaseFactory);

    // Initialize alarm seeder
    const alarmRepository = this.module.get<AlarmRepository>(AlarmsTokens.AlarmRepository);
    this.alarmSeeder = new AlarmSeeder(alarmRepository);

    return this.app;
  }

  async teardown(): Promise<void> {
    if (this.databaseFactory) {
      try {
        this.db = await this.databaseFactory.create();

        // Clean all database tables
        await this.db.deleteFrom('alarms').execute();

        console.log('🧹 Database cleaned');
      } catch (error) {
        console.error('❌ Error cleaning database: ', error);
      }
    }
    if (this.app) {
      await this.app.close();
    }
    if (this.module) {
      await this.module.close();
    }
  }

  getApp(): INestApplication {
    return this.app;
  }

  getDatabase(): KyselyDatabase {
    return this.db;
  }

  getAlarmSeeder(): AlarmSeeder {
    return this.alarmSeeder;
  }
}
