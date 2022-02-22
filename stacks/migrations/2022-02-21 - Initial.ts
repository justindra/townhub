import type { Kysely, Sql } from 'kysely';
import {
  DEFAULT_AGENCIES_TABLE_NAME,
  DEFAULT_STOPS_TABLE_NAME,
  DEFAULT_USERS_TABLE_NAME,
} from '../../backend';

// Not sure where this is coming from but @thdxr mentioned to use this instead of the
// sql import from Kysely
interface KyselyWithRaw extends Kysely<any> {
  raw: Sql['raw'];
}

/**
 * A helper to add the default audit columns to the database table
 */
const createBaseTable = (db: KyselyWithRaw, tableName: string) => {
  return db.schema
    .createTable(tableName)
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(db.raw('gen_random_uuid()'))
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo('NOW()').notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo('NOW()').notNull()
    )
    .addColumn('created_by', 'uuid', (col) => col.references('users.id'))
    .addColumn('updated_by', 'uuid', (col) => col.references('users.id'));
};

export async function up(db: KyselyWithRaw): Promise<void> {
  // Add the postgis extension so we can use Point DataType and do geoqueries
  await db
    .raw('CREATE EXTENSION IF NOT EXISTS postgis')
    .execute(undefined as any);
  await db
    .raw('CREATE EXTENSION IF NOT EXISTS pgcrypto')
    .execute(undefined as any);

  // Create the users table
  await createBaseTable(db, DEFAULT_USERS_TABLE_NAME)
    .addColumn('email', 'text', (col) => col.unique())
    .addColumn('first_name', 'text')
    .addColumn('last_name', 'text')
    .execute();

  // Insert default system user
  await db
    .raw(
      `INSERT INTO ${DEFAULT_USERS_TABLE_NAME}(email, first_name, last_name)
  VALUES('admin@townhub.ca', 'Admin', 'Townhub')`
    )
    .execute(undefined as any);

  // Create the Agencies Table
  await createBaseTable(db, DEFAULT_AGENCIES_TABLE_NAME)
    .addColumn('imported_id', 'text', (col) => col.unique())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('url', 'text', (col) => col.notNull())
    .addColumn('timezone', 'text', (col) => col.notNull())
    .addColumn('lang', 'varchar(7)')
    .addColumn('phone', 'varchar(15)')
    .addColumn('fare_url', 'text')
    .addColumn('email', 'text')
    .execute();

  // Create the Stops Table
  await createBaseTable(db, DEFAULT_STOPS_TABLE_NAME)
    .addColumn('imported_id', 'text', (col) => col.unique())
    .addColumn('code', 'text')
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('location', 'point' as any)
    .addColumn('zone_id', 'uuid')
    .addColumn('url', 'text')
    .addColumn('location_type', 'integer')
    .addColumn('parent_station', 'uuid')
    .addColumn('timezone', 'text')
    .addColumn('wheelchair_boarding', 'integer')
    .addColumn('level_id', 'uuid')
    .addColumn('platform_code', 'text')
    .execute();
}

export async function down(db: KyselyWithRaw): Promise<void> {
  // Drop the Tables created
  await db.schema.dropTable(DEFAULT_STOPS_TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(DEFAULT_AGENCIES_TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(DEFAULT_USERS_TABLE_NAME).ifExists().execute();
  // Drop the Extensions
  await db.raw('DROP EXTENSION IF EXISTS pgcrypto').execute(undefined as any);
  await db.raw('DROP EXTENSION IF EXISTS postgis').execute(undefined as any);
}
