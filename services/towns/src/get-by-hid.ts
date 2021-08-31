import { ApiGatewayWrapper } from '@townhub-libs/core';
import { Town, TownsDatabase } from '@townhub-libs/towns';

const TownsClient = new TownsDatabase();

/**
 * Gets a town's details by its HID
 */
export const main = ApiGatewayWrapper<Town, { townHid: string }>(
  async ({ pathParameters: { townHid } }) => {
    const res = await TownsClient.getByHid(townHid);
    return {
      message: `Found town with hid ${townHid}`,
      data: res,
    };
  }
);
