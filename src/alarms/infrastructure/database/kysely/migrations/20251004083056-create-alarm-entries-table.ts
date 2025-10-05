import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create alarm entry type enum
  await db.schema
    .createType('alarm_entry_type')
    .asEnum(['system', 'network', 'database', 'application', 'security', 'performance', 'availability', 'capacity'])
    .execute();

  // Create alarm_entries table
  await db.schema
    .createTable('alarm_entries')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('alarm_id', 'varchar', (col) => col.notNull().references('alarms.id').onDelete('cascade'))
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('type', sql`"alarm_entry_type"`, (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  // Create index for alarm_id for better query performance
  await db.schema.createIndex('idx_alarm_entries_alarm_id').on('alarm_entries').column('alarm_id').execute();

  // Create updated_at trigger for alarm_entries
  await sql`
    CREATE TRIGGER update_alarm_entries_updated_at BEFORE UPDATE
    ON alarm_entries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS update_alarm_entries_updated_at ON alarm_entries`.execute(db);
  await db.schema.dropIndex('idx_alarm_entries_alarm_id').execute();
  await db.schema.dropTable('alarm_entries').execute();
  await db.schema.dropType('alarm_entry_type').execute();
}
