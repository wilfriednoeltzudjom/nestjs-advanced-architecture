#!/usr/bin/env ts-node
import 'reflect-metadata';
import 'tsconfig-paths/register';

import { program } from 'commander';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { configuration } from '@/shared/configuration/configuration';
import { KyselyDatabaseFactory } from '@/shared/infrastructure/database/kysely/database.factory';
import { DatabaseMigrator } from '@/shared/infrastructure/database/kysely/migrations/database-migrator';

// Load environment variables
dotenv.config();

const scriptEntries = program
  .command('db:migrate')
  .description('CLI to run migrations')
  .version('1.0.0')
  .argument('<command>', 'Migration command: up, down, list, pending')
  .addHelpText('afterAll', readFileSync(join(__dirname, 'migrations', 'cmd', 'run.txt'), 'utf8'))
  .action(validateScriptEntries)
  .parse(process.argv);

function validateScriptEntries(args: string[]): void {
  console.log('🔌 Validating script entries:', args);

  const command = typeof args === 'string' ? args : args.filter((arg) => arg.trim().length > 0)[0];
  console.log('🔌 Command:', command);

  if (!['up', 'down', 'list', 'pending'].includes(command)) {
    throw new Error(`Invalid command: ${command}`);
  }
}

async function runMigrations(): Promise<void> {
  const [command] = scriptEntries.args;

  const configService = new ConfigService(configuration());
  const databaseFactory = new KyselyDatabaseFactory(configService, new ConsoleLogger());
  const db = await databaseFactory.create();

  try {
    console.log('🔌 Connecting to database...');

    const migrator = new DatabaseMigrator(db);

    switch (command) {
      case 'up':
        console.log('⏳ Running migrations...');
        await migrator.migrateUp();
        console.log('✅ All migrations completed successfully');
        break;

      case 'down':
        console.log('⏳ Rolling back last migration...');
        await migrator.migrateDown();
        console.log('✅ Rollback completed successfully');
        break;

      case 'list': {
        console.log('⏳ Executed migrations:');
        const executed = await migrator.listExecutedMigrations();
        if (executed.length === 0) {
          console.log('  No migrations executed yet');
        } else {
          executed.forEach((name) => console.log(`  ✅ ${name}`));
        }
        break;
      }

      case 'pending': {
        console.log('⏳ Pending migrations:');
        const pending = await migrator.listPendingMigrations();
        if (pending.length === 0) {
          console.log('  ✅ All migrations are up to date');
        } else {
          pending.forEach((name) => console.log(`  ⏳ ${name}`));
        }
        break;
      }
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (db) {
      await db.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run if called directly
if (require.main === module) {
  void runMigrations();
}
