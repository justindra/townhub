import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { authenticate } from './authenticate';
import { generatePolicyDocument } from './policy';

/**
 * The token authorizer for API Gateway, to allow authentication through Auth0.
 */
export const main = async (event: APIGatewayTokenAuthorizerEvent) => {
  try {
    const decodedToken = await authenticate(event);

    const userId = decodedToken.sub;

    const roles = decodedToken['https://townhub.ca/profile'].roles;

    // If there are enough permissions to acces this endpoint
    if (roles.length > 0) {
      return {
        principalId: userId,
        policyDocument: generatePolicyDocument(true, event.methodArn),
        // Pass the list of permissions as context to the function handler
        context: { userId, roles: JSON.stringify(roles) },
      };
    }

    // Otherwise we reject it
    return {
      policyDocument: generatePolicyDocument(false, event.methodArn),
      // Pass the list of permissions as context to the function handler
      context: { errorMessage: 'User does not have enough permissions' },
    };
  } catch (err) {
    console.log('err', err);
    // Error codes from https://www.npmjs.com/package/jsonwebtoken#errors--codes
    if (err.name === 'TokenExpiredError') {
      return {
        policyDocument: generatePolicyDocument(false, event.methodArn),
        context: { errorMessage: 'Provided token is expired' },
      };
    }
    if (err.name === 'JsonWebTokenError') {
      return {
        policyDocument: generatePolicyDocument(false, event.methodArn),
        context: { errorMessage: err.message },
      };
    }
    throw new Error('Unauthorized');
  }
};
