import {
  Database,
  DatabaseCreateInput,
  NotFoundException,
  ValidationException,
} from '@townhub-libs/core';
import { DateTime } from 'luxon';
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

  /**
   * We don't allow getting a daily data by it's ID, so we are just throwing an
   * error here
   * @param _id
   */
  async get(_id: string) {
    throw new ValidationException(
      'Please use getByDate method to get a daily data object'
    );
    return (null as unknown) as DailyTransitData;
  }

  /**
   * Get a daily transit data for a particular date and agency
   * @param agencyId The agency to search for in
   * @param date The date to check
   */
  async getByDate(agencyId: string, date: DateTime): Promise<DailyTransitData> {
    const res = await this.ddb.get({
      TableName: this.tableName,
      Key: { agency_id: agencyId, date: date.toISODate() },
    });
    if (!res.Item)
      throw new NotFoundException(
        `Unable to find a daily transit data for agency ${agencyId} on ${date.toISODate()}`
      );
    return res.Item as DailyTransitData;
  }
}
