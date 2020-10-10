import { ApiGatewayWrapper } from '@townhub-libs/core/wrappers';

/**
 * Gets the daily data for a town's shuttle service
 */
export const main = ApiGatewayWrapper(() => {
  return {
    message: 'Found some daily data',
    data: {},
  };
});
