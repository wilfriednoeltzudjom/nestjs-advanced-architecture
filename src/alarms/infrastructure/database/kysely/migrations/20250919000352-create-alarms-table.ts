import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType('alarm_severity').asEnum(['critical', 'high', 'medium', 'low']).execute();
  await db.schema
    .createTable('alarms')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('severity', sql`"alarm_severity"`, (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  // Create updated_at trigger
  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `.execute(db);

  // Create updated_at trigger
  await sql`
    CREATE TRIGGER update_alarms_updated_at BEFORE UPDATE
    ON alarms FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS update_alarms_updated_at ON alarms`.execute(db);
  await sql`DROP FUNCTION IF EXISTS update_updated_at_column`.execute(db);
  await db.schema.dropTable('alarms').execute();
  await db.schema.dropType('alarm_severity').execute();
}
