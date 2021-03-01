import { Database } from '@townhub-libs/core';
import { Vendor } from './interfaces';

export const VENDORS_DATABASE = {
  ENV: 'VENDORS_DATABASE_NAME',
  CF_OUTPUT: 'VendorsTableName',
};

export class VendorsDatabase extends Database<Vendor> {
  constructor() {
    super(VENDORS_DATABASE.ENV);
  }

  /**
   * Lists the vendors by a town
   * @param townId
   */
  async listByTown(townId: string) {
    return this.query({
      FilterExpression: '#townId = :townId',
      ExpressionAttributeNames: {
        '#townId': 'townId',
      },
      ExpressionAttributeValues: {
        ':townId': townId,
      },
    });
  }
}
