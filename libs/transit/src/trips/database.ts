import {
  Database,
  DatabaseCreateInput,
  ValidationException,
} from '@townhub-libs/core';
import { DDB_INDEX_NAMES, TransitDatabaseEnv } from '../constants';
import { TRIP_ENTITY_TYPE, Trip } from './interfaces';

type TripsDatabaseCreateInput = Omit<
  DatabaseCreateInput<Trip>,
  'route_id_service_id'
>;

/**
 * The Trips Table should be setup with the following details:
 * * PartitionKey:  `service_id`
 * * SortKey:       `route_id`
 *
 * This will allow us to make sure that the route_id|service_id combination is
 * unique in the database.
 */
export class TripsDatabase extends Database<Trip> {
  constructor() {
    super(TransitDatabaseEnv.Trips, TRIP_ENTITY_TYPE);
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
    try {
      await this.ddb.put({
        TableName: this.tableName,
        Item: newItem,
        // As this is evaluated after checking that both the PK and SK matches,
        // we don't need to check that route_id is also unique.
        ConditionExpression: 'attribute_not_exists(route_id_service_id)',
      });
    } catch (error) {
      if ((error as Error).message === 'The conditional request failed') {
        throw new ValidationException(
          `Unable to create as trip with the same service and route already exists`
        );
      } else {
        // A different error, so just throw it out
        console.error(error);
        throw error;
      }
    }

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

    // Run the Query
    const res = await this.query({
      IndexName: DDB_INDEX_NAMES.TRIPS.AGENCY_ID_SERVICE_ID,
      KeyConditionExpression:
        'agency_id = :agency_id AND service_id BETWEEN :first_service_id AND :last_service_id',
      ExpressionAttributeValues: {
        ':agency_id': agencyId,
        ':first_service_id': sortedServiceIds[0],
        ':last_service_id': sortedServiceIds[sortedServiceIds.length - 1],
      },
    });

    // And then make sure to filter out any extra services that gets added in
    return res.filter((val) => serviceIds.includes(val.service_id));
  }

  /**
   * Turn the given input into a new item object. This is used as a helper so
   * we can keep it consistent when replacing the create function.
   * @param item The input to the database
   * @param actorId The user performing the creation
   * @returns The generated item
   */
  protected generateCreateItemInput(
    item: TripsDatabaseCreateInput,
    actorId: string
  ): Trip {
    return super.generateCreateItemInput(
      {
        ...item,
        route_id_service_id: `${item.route_id}_${item.service_id}`,
      },
      actorId
    );
  }
}
