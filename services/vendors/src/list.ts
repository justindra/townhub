import { ApiGatewayWrapper } from '@townhub-libs/core';
import { Vendor, list } from '@townhub-libs/vendors';

/**
 * Lists all the vendors for the town
 */
export const main = ApiGatewayWrapper<Vendor[]>(async ({ townId }) => {
  const data = await list(townId);
  return {
    message: 'Found some vendors',
    data,
  };
});
