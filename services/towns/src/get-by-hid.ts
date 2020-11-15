import { ApiGatewayWrapper, Towns } from '@townhub-libs/core';

/**
 * Gets a town's details by its HID
 */
export const main = ApiGatewayWrapper<Towns.Town, { townHid: string }>(
  async ({ pathParameters: { townHid } }) => {
    const res = await Towns.getByHid(townHid);
    return {
      message: `Found town with hid ${townHid}`,
      data: res,
    };
  }
);
