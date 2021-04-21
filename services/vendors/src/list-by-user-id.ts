import { ApiGatewayWrapper } from '@townhub-libs/core';
import { Vendor, listByUserId } from '@townhub-libs/vendors';

/**
 * Lists all the vendors owned by a particular user
 */
export const main = ApiGatewayWrapper<Vendor[]>(async ({ userId }) => {
  const data = await listByUserId(userId);
  return {
    message: 'Found some vendors',
    data,
  };
});
