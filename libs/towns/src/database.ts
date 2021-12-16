import {
  NotFoundException,
  ValidationException,
  Database,
  DatabaseCreateInput,
} from '@townhub-libs/core';
import { Town } from './interfaces';

export const TOWNS_DATABASE = {
  ENV: 'TOWNS_DATABASE_NAME',
  CF_OUTPUT: 'TownsTableName',
};

export class TownsDatabase extends Database<Town> {
  constructor() {
    super(TOWNS_DATABASE.ENV);
  }

  /**
   * Create a new town. Must have a unique Human Readable ID
   * @param item The town to create
   * @param actorId The user creating the town
   */
  async create(item: DatabaseCreateInput<Town>, actorId: string) {
    try {
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
      FilterExpression: '#hid = :hid',
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
