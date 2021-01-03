import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { authenticate } from './authenticate';
import { generatePolicyDocument } from './policy';

export const main = async (
  event: APIGatewayTokenAuthorizerEvent
) => {
  try {
    const decodedToken = await authenticate(event);
    return {
      principalId: decodedToken.sub,
      policyDocument: generatePolicyDocument('Allow', event.methodArn),
      // TODO: When we implement RBAC, we should update the scopes provided here
      context: { scope: 'test' }
    }
  } catch (err) {
    console.log('err', err);
    return Promise.reject((err as Error).message);
  }
};
