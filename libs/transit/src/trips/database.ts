import { Database, DatabaseCreateInput } from '@townhub-libs/core';
import { DDB_INDEX_NAMES, TransitDatabaseEnv } from '../constants';
import { Trip } from './interfaces';

type TripsDatabaseCreateInput = Omit<
  DatabaseCreateInput<Trip>,
  'route_id_service_id'
>;
export class TripsDatabase extends Database<Trip> {
  constructor() {
    super(TransitDatabaseEnv.Trips);
  }

  /**
   * When creating a new trip, we want to make sure that the particular
   * service_id and route_id combination does not already exist in the database
   * @param item The new trip to create
   * @returns The trip that was created
   */
  async create(item: TripsDatabaseCreateInput): Promise<Trip> {
    const newItem = this.generateCreateItemInput(item);
    await this.ddb.put({
      TableName: this.tableName,
      Item: newItem,
      ConditionExpression:
        'attribute_not_exists(id) AND attribute_not_exists(route_id_service_id)',
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

  /**
   * We need to automaticall add the route_id and service_id combination so
   * that it's always correct
   * @param item The newly created item
   * @returns A trip that can be used for the create call
   */
  protected generateCreateItemInput(item: TripsDatabaseCreateInput): Trip {
    return super.generateCreateItemInput({
      ...item,
      // Set the combination id
      route_id_service_id: `${item.route_id}|${item.service_id}`,
    });
  }
}
