import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Sample } from '@townhub/core';

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const result = Sample.foo();
  return {
    statusCode: 200,
    body: result,
  };
};
 