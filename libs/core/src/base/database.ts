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

export type BaseEntity<TEntityType extends string = string> = {
  id: string;
  /** The time this entity was created */
  createdAt: number;
  /** The time this entity was last updated */
  updatedAt: number;
  /** The user who created this entity */
  createdBy: string;
  /** The user who last updated this entity */
  updatedBy: string;
  /**
   * The entity type to use, this is system-wide and allows us to perform
   * easier checks in the future
   */
  entityType: TEntityType;
};

export type OmitAuditFields<TItem> = Omit<
  TItem,
  'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>;
export type OmitId<TItem> = Omit<TItem, 'id'>;
export type OmitEntityType<TItem> = Omit<TItem, 'entityType'>;

export type DatabaseCreateInput<TItem> = OmitAuditFields<
  OmitEntityType<OmitId<TItem>>
>;
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

  /**
   * @param tableNameEnvVariable The ENV Variable of the Table name
   * @param entityType The entity type this Database handles if any
   */
  constructor(tableNameEnvVariable: string, protected entityType: string) {
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
   * @param actorId The user performing the create
   */
  async create(item: DatabaseCreateInput<TItem>, actorId: string) {
    const newItem: BaseEntity = {
      id: uuidv4(),
      ...item,
      createdAt: new Date().valueOf(),
      updatedAt: new Date().valueOf(),
      createdBy: actorId,
      updatedBy: actorId,
      entityType: this.entityType,
    };
    await this.ddb.put({
      TableName: this.tableName,
      Item: newItem,
    });

    return newItem as TItem;
  }

  /**
   * Update an item in the database. Allows you to simply send
   * whatever needs to be updated rather than the whole object
   *
   * @param id The id of the item to update
   * @param item The fields to update
   * @param actorId The user performing the update
   */
  async update(id: string, item: DatabaseUpdateInput<TItem>, actorId: string) {
    const oldItem = await this.get(id);
    const newItem: BaseEntity = {
      ...oldItem,
      ...item,
      updatedAt: new Date().valueOf(),
      updatedBy: actorId,
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
   * @param actorId The user performing the upsert
   */
  async upsert(item: DatabaseUpdateInput<TItem>, actorId: string) {
    if (!item.id) {
      return this.create(item as TItem, actorId);
    }

    return this.update(item.id, item, actorId);
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
      throw new NotFoundException(error.message || 'Unable to find items');
    }
  }

  /**
   * Run a dynamoDB Query to find list of items using Global Secondary Indexes
   * @param query The query to use
   */
  async query(
    query: Partial<AWS.DynamoDB.DocumentClient.QueryInput> = {}
  ): Promise<TItem[]> {
    const res = await this.ddb.query({
      TableName: this.tableName,
      ...query,
    });

    // If there are still some more results to scan through,
    // we make sure we go through and add those results in too
    if (res.LastEvaluatedKey) {
      const nextRes = await this.query({
        ...query,
        ExclusiveStartKey: res.LastEvaluatedKey,
      });
      return [...(res.Items as TItem[]), ...nextRes];
    }
    return res.Items as TItem[];
  }

  /**
   * Run a DynamoDB Query to find a list of items using scan
   * @param query The DDB Query to run
   */
  async search(
    query: Partial<DynamoDB.DocumentClient.ScanInput> = {}
  ): Promise<TItem[]> {
    const res = await this.ddb.scan({
      TableName: this.tableName,
      Select: 'ALL_ATTRIBUTES',
      ...query,
    });

    // If there are still some more results to scan through,
    // we make sure we go through and add those results in too
    if (res.LastEvaluatedKey) {
      const nextRes = await this.search({
        ...query,
        ExclusiveStartKey: res.LastEvaluatedKey,
      });
      return [...(res.Items as TItem[]), ...nextRes];
    }
    return res.Items as TItem[];
  }

  /**
   * List all existing items in the database
   */
  async list(): Promise<TItem[]> {
    return this.search();
  }
}
