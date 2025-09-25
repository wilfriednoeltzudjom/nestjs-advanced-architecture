import { Kysely, MigrationResult, MigrationResultSet, Migrator } from 'kysely';

import { DatabaseMigrationProvider } from '@/shared/infrastructure/database/kysely/migrations/database-migration.provider';

type MigrationStatus = MigrationResult['status'];

export class DatabaseMigrator {
  private migrator: Migrator;

  constructor(db: Kysely<any>) {
    this.migrator = new Migrator({
      db,
      provider: new DatabaseMigrationProvider(),
    });
  }

  async migrateUp(): Promise<void> {
    const { error, results } = await this.migrator.migrateToLatest();

    this.logResults(results);

    if (error) {
      console.error(error);
      throw new Error('Failed to migrate up');
    }
  }

  async migrateDown(): Promise<void> {
    const { error, results } = await this.migrator.migrateDown();

    this.logResults(results);

    if (error) {
      console.error(error);
      throw new Error('Failed to migrate down');
    }
  }

  async migrateTo(targetMigrationName: string): Promise<void> {
    const { error, results } = await this.migrator.migrateTo(targetMigrationName);

    this.logResults(results);

    if (error) {
      console.error(error);
      throw new Error(`Failed to migrate to ${targetMigrationName}`);
    }
  }

  async listExecutedMigrations(): Promise<string[]> {
    const db = (this.migrator as any).db as Kysely<any>;

    const migrations = await db
      .selectFrom('kysely_migration' as any)
      .select('name' as any)
      .orderBy('name' as any)
      .execute();

    return migrations.map((m: { name: string }) => m.name);
  }

  async listPendingMigrations(): Promise<string[]> {
    const executedMigrations = await this.listExecutedMigrations();
    const provider = new DatabaseMigrationProvider();
    const allMigrations = await provider.getMigrations();

    return Object.keys(allMigrations).filter((name) => !executedMigrations.includes(name));
  }

  private logResults(results?: MigrationResultSet['results']): void {
    if (!results || results.length === 0) {
      console.log('ℹ️ No migrations to run');
      return;
    }

    const loggingTemplateStrategies: Record<MigrationStatus, string> = {
      Success: '✅ Migration "{{migrationName}}" was executed successfully',
      Error: '❌ Migration "{{migrationName}}" failed',
      NotExecuted: 'ℹ️ Migration "{{migrationName}}" was not executed',
    };

    results.forEach((migrationResult) => {
      const template = loggingTemplateStrategies[migrationResult.status];
      if (template) {
        console.log(template.replace('{{migrationName}}', migrationResult.migrationName));
      }
    });
  }
}
