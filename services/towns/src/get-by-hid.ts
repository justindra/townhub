import { ApiGatewayWrapper } from '@townhub-libs/core';
import { Town, getByHid } from '@townhub-libs/towns';

/**
 * Gets a town's details by its HID
 */
export const main = ApiGatewayWrapper<Town, { townHid: string }>(
  async ({ pathParameters: { townHid } }) => {
    const res = await getByHid(townHid);
    return {
      message: `Found town with hid ${townHid}`,
      data: res,
    };
  }
);
