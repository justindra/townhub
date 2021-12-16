import { Database, DatabaseCreateInput } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { DailyTransitData } from './interfaces';

/**
 * The Daily Data Table should be setup with the following details:
 * * PartitionKey: `agency_id`
 * * SortKey:      `date`
 *
 * This will allow us to make sure that the agency_id|date combination is
 * unique in the database. As we should be generating a single item for each
 * day's worth of data.
 */
export class DailyDataDatabase extends Database<DailyTransitData> {
  constructor() {
    super(TransitDatabaseEnv.DailyData);
  }

  /**
   * When creating a daily data, we want to make sure that the particular
   * agency_id and date combination does not already exist in the database
   * @param item The new dailyData to create
   * @param actorId The user performing the create
   * @returns The dailydata that was created
   */
  async create(
    item: DatabaseCreateInput<DailyTransitData>,
    actorId: string
  ): Promise<DailyTransitData> {
    const newItem = this.generateCreateItemInput(item, actorId);
    await this.ddb.put({
      TableName: this.tableName,
      Item: newItem,
      // As this is evaluated after checking that both the PK and SK matches,
      // we don't need to check that service_id is also unique.
      ConditionExpression: 'attribute_not_exists(agency_id)',
    });

    return newItem;
  }
}
