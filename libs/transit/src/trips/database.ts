import { Database, DatabaseCreateInput } from '@townhub-libs/core';
import { DDB_INDEX_NAMES, TransitDatabaseEnv } from '../constants';
import { Trip } from './interfaces';

type TripsDatabaseCreateInput = Omit<
  DatabaseCreateInput<Trip>,
  'route_id_service_id'
>;

/**
 * The Trips Table should be setup with the following details:
 * * PartitionKey: `route_id`
 * * SortKey:      `service_id`
 *
 * This will allow us to make sure that the route_id|service_id combination is
 * unique in the database.
 */
export class TripsDatabase extends Database<Trip> {
  constructor() {
    super(TransitDatabaseEnv.Trips);
  }

  /**
   * When creating a new trip, we want to make sure that the particular
   * service_id and route_id combination does not already exist in the database
   * @param item The new trip to create
   * @param actorId The user performing the create
   * @returns The trip that was created
   */
  async create(item: TripsDatabaseCreateInput, actorId: string): Promise<Trip> {
    const newItem = this.generateCreateItemInput(item, actorId);
    await this.ddb.put({
      TableName: this.tableName,
      Item: newItem,
      // As this is evaluated after checking that both the PK and SK matches,
      // we don't need to check that service_id is also unique.
      ConditionExpression: 'attribute_not_exists(route_id)',
    });

    return newItem;
  }

  /**
   * Get all trips that exist for a list of services
   * @param agencyId The agency the trips belong to
   * @param serviceIds The list of services to look for
   * @returns The list of trips
   */
  async getAllTripsForServices(
    agencyId: string,
    serviceIds: string[]
  ): Promise<Trip[]> {
    // Sort the serviceIds so that we can narrow down our search based on the UUID
    const sortedServiceIds = serviceIds.sort();

    // Create the object for the values
    const serviceIdValues: Record<string, string> = {};
    sortedServiceIds.forEach((val, index) => {
      serviceIdValues[`:service${index}`] = val;
    });

    // Run the Query
    const res = await this.query({
      IndexName: DDB_INDEX_NAMES.TRIPS.AGENCY_ID_SERVICE_ID,
      KeyConditionExpression:
        'agency_id = :agency_id AND service_id BETWEEN :first_service_id AND :last_service_id',
      FilterExpression: `service_id IN (${Object.keys(serviceIdValues).join(
        ', '
      )})`,
      ExpressionAttributeValues: {
        ':agency_id': agencyId,
        ':first_service_id': sortedServiceIds[0],
        ':last_service_id': sortedServiceIds[sortedServiceIds.length - 1],
        ...serviceIdValues,
      },
    });

    return res;
  }
}
