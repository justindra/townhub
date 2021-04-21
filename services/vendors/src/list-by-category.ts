import { ApiGatewayWrapper } from '@townhub-libs/core';
import { Vendor, listByCategory } from '@townhub-libs/vendors';

/**
 * Lists all the vendors for the town
 */
export const main = ApiGatewayWrapper<Vendor[], { category: string }>(
  async ({ townId, pathParameters: { category } }) => {
    const data = await listByCategory(townId, category);
    return {
      message: 'Found some vendors',
      data,
    };
  }
);
