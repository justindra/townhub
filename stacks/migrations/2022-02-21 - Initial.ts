import type { Kysely, Sql } from 'kysely';
import {
  DEFAULT_AGENCIES_TABLE_NAME,
  DEFAULT_CALENDARS_TABLE_NAME,
  DEFAULT_CALENDAR_DATES_TABLE_NAME,
  DEFAULT_ROUTES_TABLE_NAME,
  DEFAULT_STOPS_TABLE_NAME,
  DEFAULT_STOP_TIMES_TABLE_NAME,
  DEFAULT_TRIPS_TABLE_NAME,
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
      col.defaultTo(db.raw('NOW()')).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(db.raw('NOW()')).notNull()
    )
    .addColumn('created_by', 'uuid', (col) =>
      col.references(`${DEFAULT_USERS_TABLE_NAME}.id`)
    )
    .addColumn('updated_by', 'uuid', (col) =>
      col.references(`${DEFAULT_USERS_TABLE_NAME}.id`)
    );
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
    .addColumn('point', 'point' as any)
    .addColumn('zone_id', 'uuid')
    .addColumn('url', 'text')
    .addColumn('location_type', 'integer')
    .addColumn('parent_station', 'uuid')
    .addColumn('timezone', 'text')
    .addColumn('wheelchair_boarding', 'integer')
    .addColumn('level_id', 'uuid')
    .addColumn('platform_code', 'text')
    .execute();

  // Create the routes table
  await createBaseTable(db, DEFAULT_ROUTES_TABLE_NAME)
    .addColumn('imported_id', 'text', (col) => col.unique())
    .addColumn('agency_id', 'uuid', (col) =>
      col.references(`${DEFAULT_AGENCIES_TABLE_NAME}.id`).notNull()
    )
    .addColumn('route_short_name', 'text', (col) => col.notNull())
    .addColumn('route_long_name', 'text', (col) => col.notNull())
    .addColumn('route_desc', 'text')
    .addColumn('route_type', 'integer', (col) => col.notNull())
    .addColumn('route_url', 'text')
    .addColumn('route_color', 'text')
    .addColumn('route_text_color', 'text')
    .addColumn('route_sort_order', 'integer')
    .addColumn('continuous_pickup', 'integer')
    .addColumn('continuous_drop_off', 'integer')
    .execute();

  // Create the Calendars Table
  await createBaseTable(db, DEFAULT_CALENDARS_TABLE_NAME)
    .addColumn('imported_id', 'text', (col) => col.unique())
    .addColumn('monday', 'integer', (col) => col.notNull())
    .addColumn('tuesday', 'integer', (col) => col.notNull())
    .addColumn('wednesday', 'integer', (col) => col.notNull())
    .addColumn('thursday', 'integer', (col) => col.notNull())
    .addColumn('friday', 'integer', (col) => col.notNull())
    .addColumn('saturday', 'integer', (col) => col.notNull())
    .addColumn('sunday', 'integer', (col) => col.notNull())
    .addColumn('start_date', 'date', (col) => col.notNull())
    .addColumn('end_date', 'date', (col) => col.notNull())
    .addColumn('service_name', 'text')
    .execute();

  // Create the trips table
  await createBaseTable(db, DEFAULT_TRIPS_TABLE_NAME)
    .addColumn('imported_id', 'text', (col) => col.unique())
    .addColumn('route_id', 'uuid', (col) =>
      col.references(`${DEFAULT_ROUTES_TABLE_NAME}.id`).notNull()
    )
    .addColumn('service_id', 'uuid', (col) =>
      col.references(`${DEFAULT_CALENDARS_TABLE_NAME}.id`).notNull()
    )
    .addColumn('trip_headsign', 'text')
    .addColumn('trip_short_name', 'text')
    .addColumn('direction_id', 'integer')
    .addColumn('block_id', 'uuid')
    .addColumn(
      'shape_id',
      'uuid'
      // TODO: maybe add this if we decide to add shapes now
      // (col) => col.references(`${DEFAULT_SHAPES_TABLE_NAME}.id`)
    )
    .addColumn('wheelchair_accessible', 'integer')
    .addColumn('bikes_allowed', 'integer')
    .execute();

  // Create the Stop Times table
  await createBaseTable(db, DEFAULT_STOP_TIMES_TABLE_NAME)
    .addColumn('trip_id', 'uuid', (col) =>
      col.references(`${DEFAULT_TRIPS_TABLE_NAME}.id`).notNull()
    )
    .addColumn('arrival_time', 'time')
    .addColumn('departure_time', 'time')
    .addColumn('stop_id', 'uuid', (col) =>
      col.references(`${DEFAULT_STOPS_TABLE_NAME}.id`).notNull()
    )
    .addColumn('stop_sequence', 'integer', (col) => col.notNull())
    .addColumn('stop_headsign', 'text')
    .addColumn('pickup_type', 'integer')
    .addColumn('drop_off_type', 'integer')
    .addColumn('continuous_pickup', 'integer')
    .addColumn('continuous_drop_off', 'integer')
    .addColumn('shape_dist_travel', 'decimal')
    .addColumn('timepoint', 'integer')
    .execute();

  // Create the Calendar Dates table
  await createBaseTable(db, DEFAULT_CALENDAR_DATES_TABLE_NAME)
    .addColumn('service_id', 'uuid', (col) =>
      col.references(`${DEFAULT_CALENDARS_TABLE_NAME}.id`).notNull()
    )
    .addColumn('date', 'date', (col) => col.notNull())
    .addColumn('exception_type', 'integer', (col) => col.notNull())
    .execute();
}

export async function down(db: KyselyWithRaw): Promise<void> {
  // Drop the Tables created
  await db.schema
    .dropTable(DEFAULT_CALENDAR_DATES_TABLE_NAME)
    .ifExists()
    .execute();
  await db.schema.dropTable(DEFAULT_STOP_TIMES_TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(DEFAULT_TRIPS_TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(DEFAULT_CALENDARS_TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(DEFAULT_ROUTES_TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(DEFAULT_STOPS_TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(DEFAULT_AGENCIES_TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(DEFAULT_USERS_TABLE_NAME).ifExists().execute();
  // Drop the Extensions
  await db.raw('DROP EXTENSION IF EXISTS pgcrypto').execute(undefined as any);
  await db.raw('DROP EXTENSION IF EXISTS postgis').execute(undefined as any);
}
