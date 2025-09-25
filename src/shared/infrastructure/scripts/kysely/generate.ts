#!/usr/bin/env ts-node

import { Option, program } from 'commander';
import { writeFileSync } from 'fs';
import { mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { MigrationConfig, validateScriptEntries } from '@/shared/infrastructure/scripts/kysely/migrations/args-parser';
import { MigrationTemplateProcessor } from '@/shared/infrastructure/scripts/kysely/migrations/template-processor';
import { isTemplateType } from '@/shared/infrastructure/scripts/kysely/migrations/types';

const scriptEntries = program
  .command('db:migration:generate')
  .description('CLI to generate a migration file')
  .version('1.0.0')
  .addOption(new Option('-d, --domain <domain>', 'Domain name'))
  .addOption(
    new Option(
      '-t, --type <type> <table> <column>',
      'Migration type: create-table, add-column, create-index, empty',
    ).default('empty'),
  )
  .addOption(new Option('-n, --name <name>', "Migration name (optional if type is provided, except for 'empty'"))
  .argument('[args...]', 'Additional arguments for the migration type')
  .addHelpText('afterAll', readFileSync(join(__dirname, 'migrations', 'cmd', 'generate.txt'), 'utf8'))
  .action(validateScriptEntries)
  .parse(process.argv);

function generateTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-:T.]/g, '')
    .slice(0, 14);
}

function toKebabCase(str: string | undefined): string {
  if (!str) {
    throw new Error('String is undefined');
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function generateFileName(config: MigrationConfig, timestamp: string): string {
  // If name is explicitly provided, use it
  if (config.name) {
    return `${timestamp}-${toKebabCase(config.name)}.ts`;
  }

  // Otherwise, generate name based on type and arguments
  switch (config.type) {
    case 'create-table':
      return `${timestamp}-create-${toKebabCase(config.table)}-table.ts`;
    case 'add-column':
      return `${timestamp}-add-${toKebabCase(config.column)}-to-${toKebabCase(config.table)}.ts`;
    case 'create-index':
      return `${timestamp}-create-${toKebabCase(config.column)}-to-${toKebabCase(config.table)}-index.ts`;
    default:
      throw new Error(`Unknown migration type: ${config.type}`);
  }
}

export async function generateMigrationTemplate(config: MigrationConfig): Promise<string> {
  const processor = new MigrationTemplateProcessor();
  if (isTemplateType(config.type)) {
    return processor.generateMigrationTemplate(config);
  }

  throw new Error(`Unknown migration type`);
}

async function main(): Promise<void> {
  try {
    // Parse command line arguments
    const config: MigrationConfig = scriptEntries.opts();
    const [table, column] = scriptEntries.args;
    config.args = scriptEntries.args;
    config.table = table;
    config.column = column;

    // Create template
    const template = await generateMigrationTemplate(config);

    // Generate file path
    const timestamp = generateTimestamp();
    const filename = generateFileName(config, timestamp);
    const migrationsDir = join(
      process.cwd(),
      'src',
      config.domain,
      'infrastructure',
      'database',
      'kysely',
      'migrations',
    );

    // Ensure directory exists
    mkdirSync(migrationsDir, {
      recursive: true,
    });

    const migrationPath = join(migrationsDir, filename);

    // Write the migration file
    writeFileSync(migrationPath, template);

    console.log(`✅ Migration created: ${migrationPath}`);
    console.log(`✅ Domain: ${config.domain}`);
    console.log(`✅ Type: ${config.type}`);
  } catch (error: any) {
    console.error('❌ Error generating migration:', error.message);
    console.error('\nRun with --help for usage information');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  void main();
}
