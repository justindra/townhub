import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, World! Your request was received at ${event.requestContext.time}.`,
  };
};

export const handlerEvent: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2,
  context
) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ event, context }),
  };
};
