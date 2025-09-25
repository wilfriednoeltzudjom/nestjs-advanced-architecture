import * as fs from 'fs/promises';
import { Migration, MigrationProvider } from 'kysely';
import * as path from 'path';

export class DatabaseMigrationProvider implements MigrationProvider {
  private domains = ['alarms'];

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    const srcPath = path.join(process.cwd(), 'src');

    try {
      const domains = (await fs.readdir(srcPath)).filter((domain) => this.domains.includes(domain));

      for (const domain of domains) {
        const migrationsPath = path.join(srcPath, domain, 'infrastructure/database/kysely/migrations');

        try {
          const files = await fs.readdir(migrationsPath);
          for (const fileName of files) {
            if (fileName.endsWith('.ts')) {
              const migrationKey = fileName.replace('.ts', '');

              // Use dynamic import for better compatibility
              const modulePath = path.join(migrationsPath, fileName);
              const migration = await this.importMigration(modulePath);

              migrations[migrationKey] = {
                up: migration.up.bind(migration),
                down: migration.down?.bind(migration),
              };

              console.log(`Found migration: ${migrationKey} from ${domain}`);
            }
          }
        } catch {
          // Domain doesn't have migrations directory
          continue;
        }
      }
      console.log(`📊 Total migrations found: ${Object.keys(migrations).length}`);

      // Sort migrations by timestamp (they're prefixed with timestamps)
      return this.sortMigrations(migrations);
    } catch (error) {
      console.error('Error collecting migrations:', error);
      throw error;
    }
  }

  private async importMigration(filePath: string): Promise<Migration> {
    try {
      // Try dynamic import first
      // Directly use filePath because ts-node uses commonjs
      const module = await import(filePath);
      return {
        up: module.up || module.default?.up,
        down: module.down || module.default?.down,
      };
    } catch (error) {
      console.log(error);

      throw new Error(`Failed to import migration from ${filePath}`);
    }
  }

  private sortMigrations(migrations: Record<string, Migration>): Record<string, Migration> {
    return Object.keys(migrations)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = migrations[key];
          return acc;
        },
        {} as Record<string, Migration>,
      );
  }
}
