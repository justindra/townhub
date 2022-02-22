import client, { iDataAPIClient } from 'data-api-client';
import { DateTime } from 'luxon';
import {
  BaseEntity,
  DatabaseCreateInput,
  DatabaseUpdateInput,
} from './interfaces';

const db = client({
  database: process.env.DATABASE_NAME ?? '',
  resourceArn: process.env.DATABASE_CLUSTER_ARN ?? '',
  secretArn: process.env.DATABASE_SECRET_ARN ?? '',
});

const convertItemToColumnAndValues = <TItem extends Record<string, any>>(
  item: TItem,
  ignoredFields: (keyof TItem)[] = []
) => {
  let columns: (keyof TItem)[] = [];
  let values: string[] = [];

  Object.keys(item)
    .filter((key) => !ignoredFields.includes(key))
    .forEach((key) => {
      if (!item[key as keyof TItem]) return;
      columns.push(key as keyof TItem);
      values.push(item[key as keyof TItem]?.toString() || '');
    });

  return { columns, values };
};

export class DatabaseTable<
  TItem extends BaseEntity,
  TDatabaseItem extends BaseEntity = TItem
> {
  /** The database instance to send queries to */
  private db: iDataAPIClient;

  /**
   * The client for an Agency Table to make it easier to just create and update
   * item(s).
   * @param tableName The tablename to use
   */
  constructor(private tableName: string) {
    this.db = db;
  }

  /**
   * Create an item in the Database
   * @param item The item to create
   * @param actorId The Id of the user adding the items
   * @returns
   */
  async create(
    item: DatabaseCreateInput<TItem>,
    actorId: string
  ): Promise<TItem> {
    const { columns, values } = convertItemToColumnAndValues(
      this.beforeDBTransform({
        ...item,
        created_by: actorId,
        updated_by: actorId,
      } as Partial<TItem>)
    );

    const query = `INSERT INTO ${this.tableName}(${columns.join(', ')})
VALUES (${values.map((val) => `'${val}'`).join(', ')})
RETURNING *`;
    const res = await this.db.query(query);
    return this.afterDBTransform(res.records?.[0]);
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
    item: DatabaseUpdateInput<TItem>,
    actorId: string
  ): Promise<TItem> {
    const { columns, values } = convertItemToColumnAndValues(
      this.beforeDBTransform({
        ...item,
        // Set the audit values
        updated_at: DateTime.local().toISO(),
        updated_by: actorId,
      }),
      // Ignore these values, so that it can never be updated
      ['created_at', 'created_by', 'id']
    );

    const query = `UPDATE ${this.tableName}
SET ${columns.map((col, index) => `${col} = '${values[index]}'`).join(', ')}
WHERE id = '${id}'
RETURNING *`;

    const res = await this.db.query(query);
    return this.afterDBTransform(res.records?.[0]);
  }

  /**
   * List all data from the table
   */
  async list(): Promise<TItem[]> {
    const res = await this.db.query(`SELECT * from ${this.tableName}`);
    return res.records.map(this.afterDBTransform);
  }

  /**
   * A transformer to transform any of the item(s) to fit with the database item
   * before it gets inserted back in, or updated.
   * @param item The item to push in
   */
  beforeDBTransform<TBeforeItem = Partial<TItem>>(
    item: TBeforeItem
  ): TDatabaseItem {
    return item as any as TDatabaseItem;
  }

  /**
   * A transformer to transform any of the database item(s) into one that fits
   * the interface as required for usage
   * @param databaseItem The raw database item
   */
  afterDBTransform(databaseItem: TDatabaseItem): TItem {
    return databaseItem as any as TItem;
  }
}
