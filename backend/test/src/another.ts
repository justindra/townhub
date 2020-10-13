import { ApiGatewayWrapper } from '@townhub-libs/core';

/**
 * Here is some test documentation for this function yay
 * @param event
 */
export const main = ApiGatewayWrapper(async () => {
  return {
    statusCode: 200,
    message: 'Go Serverless v1.20! Your function executed successfully!',
    data: `should have no other imports except for`,
  };
});
