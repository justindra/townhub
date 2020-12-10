import { ApiGatewayWrapper } from '@townhub-libs/core';
import { Vendor, VendorsDatabase } from '@townhub-libs/vendors';

/**
 * Lists all the vendors for the town
 */
export const main = ApiGatewayWrapper<Vendor[]>(async ({ townId }) => {
  const VendorsClient = new VendorsDatabase();
  const data = await VendorsClient.listByTown(townId);
  return {
    message: 'Found some vendors',
    data,
  };
});
