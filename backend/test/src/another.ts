import { YAY } from '@townhub-libs/core/another';
import { somTHINGis } from '@townhub-libs/core/some-file';
import { APIGatewayProxyHandler } from 'aws-lambda';

/**
 * Here is some test documentation for this function yay
 * @param event
 */
export const main: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.20! Your function executed successfully!',
        test: `should have no other imports except for ${YAY} ${somTHINGis}`,
        input: event,
      },
      null,
      2
    ),
  };
};
