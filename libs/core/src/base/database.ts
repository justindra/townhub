import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from './exceptions';

const client = new DynamoDB.DocumentClient();

const ddb = {
  get: (params: DynamoDB.DocumentClient.GetItemInput) =>
    client.get(params).promise(),
  put: (params: DynamoDB.DocumentClient.PutItemInput) =>
    client.put(params).promise(),
  query: (params: DynamoDB.DocumentClient.QueryInput) =>
    client.query(params).promise(),
  update: (params: DynamoDB.DocumentClient.UpdateItemInput) =>
    client.update(params).promise(),
  delete: (params: DynamoDB.DocumentClient.DeleteItemInput) =>
    client.delete(params).promise(),
  scan: (params: DynamoDB.DocumentClient.ScanInput) =>
    client.scan(params).promise(),
  batchGet: (params: DynamoDB.DocumentClient.BatchGetItemInput) =>
    client.batchGet(params).promise(),
};

export type BaseEntity = {
  id: string;
  /** The time this entity was created */
  created_at: number;
  /** The time this entity was updated */
  updated_at: number;
  /**
   * The time this entity was created
   * @deprecated
   */
  createdAt?: number;
  /**
   * The time this entity was updated
   * @deprecated
   */
  updatedAt?: number;
};

export type OmitAuditFields<TItem> = Omit<TItem, 'created_at' | 'updated_at'>;
export type OmitId<TItem> = Omit<TItem, 'id'>;

export type DatabaseCreateInput<TItem> = OmitAuditFields<OmitId<TItem>>;
export type DatabaseUpdateInput<TItem> = Partial<TItem>;

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : A;

export type DatabaseQueryInput<TItem> = {
  [key in keyof TItem]: ArrayElement<TItem[key]>;
};

/**
 * A Database class with basic CRUD functionalities
 * that can be extended for different tables
 */
export class Database<TItem extends BaseEntity = any> {
  protected ddb: typeof ddb = ddb;
  protected tableName: string = '';

  constructor(tableNameEnvVariable: string) {
    const tableName = process.env[tableNameEnvVariable];
    if (!tableName) {
      console.warn(
        `Please specify the ${tableNameEnvVariable} environment variable`
      );
      return;
    }
    this.tableName = tableName;
  }

  /**
   * Get an item based on its id
   * @param id The id of the item to get
   */
  async get(id: string) {
    const res = await this.ddb.get({
      TableName: this.tableName,
      Key: { id },
    });
    if (!res.Item)
      throw new NotFoundException(`Unable to find item with the id ${id}`);
    return res.Item as TItem;
  }

  /**
   * Create a new item in the database
   * @param item The item to place in
   */
  async create(item: DatabaseCreateInput<TItem>) {
    const newItem = this.generateCreateItemInput(item);
    await this.ddb.put({
      TableName: this.tableName,
      Item: newItem,
      ConditionExpression: 'attribute_not_exists(id)',
    });

    return newItem as TItem;
  }

  /**
   * Update an item in the database. Allows you to simply send
   * whatever needs to be updated rather than the whole object
   *
   * @param id The id of the item to update
   * @param item The fields to update
   */
  async update(id: string, item: DatabaseUpdateInput<TItem>) {
    const oldItem = await this.get(id);
    const newItem = {
      ...oldItem,
      ...item,
      updated_at: new Date().valueOf(),
      // TODO: remove once all is deprecated
      updatedAt: new Date().valueOf(),
    };

    await this.ddb.put({
      TableName: this.tableName,
      Item: newItem,
    });

    return newItem as TItem;
  }

  /**
   * Upsert an item into the database, e.g. create it if it doesn't exist
   * or update an existing one into the database
   * @param item The item to upsert
   */
  async upsert(item: DatabaseUpdateInput<TItem>) {
    if (!item.id) {
      return this.create(item as TItem);
    }

    return this.update(item.id, item);
  }

  /**
   * Delete an item
   * @param id The id of the item to delete
   */
  async delete(id: string) {
    return this.ddb.delete({
      TableName: this.tableName,
      Key: { id },
    });
  }

  /**
   * Hydrate a list of ids from the database
   * @param ids The list of ids to retrieve
   */
  async hydrate(ids: string[]): Promise<TItem[]> {
    if (!ids.length) return [];
    try {
      const params: DynamoDB.DocumentClient.BatchGetItemInput = {
        RequestItems: {
          [this.tableName]: {
            Keys: ids.map((id) => ({ id })),
          },
        },
      };
      const data = await this.ddb.batchGet(params);

      return (data.Responses?.[this.tableName] as TItem[]) ?? [];
    } catch (error) {
      throw new NotFoundException(
        (error as Error).message || 'Unable to find items'
      );
    }
  }

  /**
   * Run a DynamoDB Query to find a list of items
   * @param query The DDB Query to run
   */
  async query(
    query: Partial<DynamoDB.DocumentClient.QueryInput>
  ): Promise<TItem[]> {
    const res = await this.ddb.query({
      TableName: this.tableName,
      Select: 'ALL_ATTRIBUTES',
      ...query,
    });

    // If there are no more results to get, then return
    if (!res.LastEvaluatedKey) return res.Items as TItem[];

    // Otherwise, resend the query whilst specifying the ExclusiveStartKey
    const items = await this.query({
      ...query,
      ExclusiveStartKey: res.LastEvaluatedKey,
    });
    // Then merge and return the results
    return [...(res.Items as TItem[]), ...items];
  }

  /**
   * List all existing items in the database
   */
  async list(): Promise<TItem[]> {
    const res = await this.ddb.scan({
      TableName: this.tableName,
      Select: 'ALL_ATTRIBUTES',
    });

    return res.Items as TItem[];
  }

  /**
   * Turn the given input into a new item object. This is used as a helper so
   * we can keep it consistent when replacing the create function.
   * @param item The input to the database
   * @returns The generated item
   */
  protected generateCreateItemInput(item: DatabaseCreateInput<TItem>): TItem {
    return {
      id: uuidv4(),
      ...item,
      created_at: new Date().valueOf(),
      updated_at: new Date().valueOf(),
      // TODO: Remove the below once we are happy it has been removed
      createdAt: new Date().valueOf(),
      updatedAt: new Date().valueOf(),
    } as TItem;
  }
}
