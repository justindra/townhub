import { Database } from '@townhub-libs/core';
import { DateTime } from 'luxon';
import { DDB_INDEX_NAMES, TransitDatabaseEnv } from '../constants';
import { Service } from './interfaces';

export class ServicesDatabase extends Database<Service> {
  constructor() {
    super(TransitDatabaseEnv.Services);
  }

  /**
   * Get a list of all services that is occuring during a given time range
   * @param agencyId The agency the service belongs to
   * @param startDate The start date to search for
   * @param endDate The end date to search for
   * @returns List of services
   */
  async getServicesBetweenRange(
    agencyId: string,
    startDate: DateTime,
    endDate: DateTime
  ): Promise<Service[]> {
    const res = await this.query({
      IndexName: DDB_INDEX_NAMES.SERVICES.AGENCY_ID_END_DATE,
      // Find all that is in the future first
      KeyConditionExpression:
        'agency_id = :agency_id AND end_date >= :query_start_date',
      // And then filter to make sure the start date is before the end date
      FilterExpression: 'start_date <= :query_end_date',
      ExpressionAttributeValues: {
        ':agency_id': agencyId,
        ':query_start_date': startDate.toISODate(),
        ':query_end_date': endDate.toISODate(),
      },
    });

    return res;
  }
}
