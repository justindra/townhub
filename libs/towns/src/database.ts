import {
  NotFoundException,
  ValidationException,
  Database,
  DatabaseCreateInput,
} from '@townhub-libs/core';
import { TOWNS_DATABASE } from './constants';
import { Town } from './interfaces';

export class TownsDatabase extends Database<
  Town,
  typeof TOWNS_DATABASE.ENTITY_TYPE
> {
  constructor() {
    super(TOWNS_DATABASE.ENV, TOWNS_DATABASE.ENTITY_TYPE);
  }

  /**
   * Create a new town. Must have a unique Human Readable ID
   * @param item The town to create
   * @param actorId The user creating the town
   */
  async create(item: DatabaseCreateInput<Town>, actorId: string) {
    try {
      // Unfortunately DynamoDB's Condition Expression for `put`s only works
      // with the PartitionKey. So we need to do this check for existing HIDs
      // client-side here.
      const existingTown = await this.getByHid(item.hid);
      if (existingTown)
        throw new ValidationException(`Town exists with HID: ${item.hid}`);
    } catch (error) {
      // If the error is anthing but not found, we re-throw the error to be
      // handled by the parent
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    // We are here, so must be able to continue
    return super.create(item, actorId);
  }

  /**
   * Get by the human readable ID
   * @param hid The human readable ID to search for
   */
  async getByHid(hid: string) {
    const res = await this.query({
      IndexName: 'hid',
      KeyConditionExpression: '#hid = :hid',
      ExpressionAttributeNames: {
        '#hid': 'hid',
      },
      ExpressionAttributeValues: {
        ':hid': hid,
      },
    });

    if (!res.length) {
      throw new NotFoundException(`Unable to find town with HID: ${hid}`);
    }

    return res[0];
  }
}
