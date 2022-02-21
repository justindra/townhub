import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Sample } from '@townhub/core';
import { Transite } from '@townhub/core/transit';

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const result = Sample.foo();
  return {
    statusCode: 200,
    body: JSON.stringify({ result, Transite }),
  };
};
