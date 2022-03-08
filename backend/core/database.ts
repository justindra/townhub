import { RDSDataService } from 'aws-sdk';
import { Kysely, MutationObject, Selectable, sql, Updateable } from 'kysely';
import { DataApiDialect } from 'kysely-data-api';
import { DateTime } from 'luxon';
import { DatabaseCreateInput, Nullable } from './interfaces';

/**
 * A wrapper around the database so that we can just make some simple calls to
 * do simple CRUD for different tables.
 */
export class DatabaseTable<
  TDatabase extends Record<string, any>,
  TTableName extends keyof TDatabase & string,
  TItem = Selectable<TDatabase[TTableName]>
> {
  protected readonly kysely: Kysely<TDatabase>;

  constructor(private tableName: TTableName) {
    this.kysely = new Kysely<TDatabase>({
      dialect: new DataApiDialect({
        mode: 'postgres',
        driver: {
          client: new RDSDataService(),
          database: process.env.DATABASE_NAME ?? '',
          resourceArn: process.env.DATABASE_CLUSTER_ARN ?? '',
          secretArn: process.env.DATABASE_SECRET_ARN ?? '',
        },
      }),
    });
    /**
     * TODO:
     *  - Setup Kysely plugin to automatically transform date fields from DateTime
     *    to ISO string before sending to the database and then re-transform back
     *    to the DateTime object when it comes back. (See the camelCase plugin for
     *    inspiration), we can do this for any fields that ends with `_at`.
     *  - May also need the same with UUIDs for id fields
     */
  }

  /**
   * Create an item in the Database
   * @param item The item to create
   * @param actorId The Id of the user adding the items
   * @returns
   */
  async create(
    item: DatabaseCreateInput<TDatabase[TTableName]>,
    actorId: Nullable<string>
  ) {
    const newValues = this.beforeDBTransform({
      ...(item as any as TItem),
      created_by: actorId,
      updated_by: actorId,
    });
    const res = await this.kysely
      .insertInto(this.tableName)
      .values(newValues as any)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.afterDBTransform(res);
  }

  /**
   * Update a single item in the database
   * @param id The id of the item to update
   * @param item A partial of the item that we want to set
   * @param actorId The Id of the user updating the item
   * @returns
   */
  async update(
    id: string,
    item: MutationObject<TDatabase, TTableName>,
    actorId: Nullable<string>
  ) {
    const values = this.beforeDBTransform({
      ...(item as any),
      // Set the audit values
      updated_at: DateTime.local().toISO(),
      updated_by: actorId,
    });

    const res = await this.kysely
      .updateTable(this.tableName)
      .set(values as MutationObject<TDatabase, TTableName>)
      .where('id', '=', id as any)
      .returningAll()
      .executeTakeFirst();

    return this.afterDBTransform(res as any);
  }

  /**
   * Get an item from the table
   * @param id the id of the item to get
   */
  async get(id: string) {
    const res = await this.kysely
      .selectFrom(this.tableName)
      .selectAll()
      .where('id', '=', sql`${id}::uuid`)
      .execute();

    if (!res.length) return null;

    return this.afterDBTransform(res[0] as any);
  }

  /**
   * List all data from the table
   */
  async list() {
    const res = await this.kysely
      .selectFrom(this.tableName)
      .selectAll()
      .execute();

    return res.map(this.afterDBTransform as any);
  }

  /**
   * A transformer to transform any of the item(s) to fit with the database item
   * before it gets inserted back in, or updated.
   * @param item The item to push in
   */
  beforeDBTransform<TAfterItem extends Updateable<TDatabase[TTableName]>>(
    item: TItem
  ): TAfterItem {
    return item as any as TAfterItem;
  }

  /**
   * A transformer to transform any of the database item(s) into one that fits
   * the interface as required for usage
   * @param databaseItem The raw database item
   */
  afterDBTransform(
    databaseItem: Awaited<Selectable<TDatabase[TTableName]>>
  ): TItem {
    return databaseItem as any as TItem;
  }
}
