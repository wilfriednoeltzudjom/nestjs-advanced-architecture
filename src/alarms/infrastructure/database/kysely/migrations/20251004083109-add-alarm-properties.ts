import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add new columns to alarms table
  await db.schema
    .alterTable('alarms')
    .addColumn('triggered_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('is_acknowledged', 'boolean', (col) => col.defaultTo(false).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove the added columns
  await db.schema.alterTable('alarms').dropColumn('triggered_at').dropColumn('is_acknowledged').execute();
}
