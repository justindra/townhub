import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import {
  filterPermissionsForAction,
  getPermissionsForRoles,
  Namespace,
} from '@townhub-libs/auth';
import { authenticate } from './authenticate';
import { generatePolicyDocument } from './policy';

/**
 * Breakdown the methodArn into something we can understand easier
 * @param methodArn The method arn to breakdown
 */
const breakdownMethodArn = (methodArn: string) => {
  const [arn, stage, method, ...path] = methodArn.split('/');
  const fullPath = path.join('/');
  const namespace = fullPath.split('/:')[0];
  return {
    arn,
    stage,
    method,
    namespace: namespace as Namespace,
    path: fullPath,
  };
};

export const main = async (event: APIGatewayTokenAuthorizerEvent) => {
  try {
    const arnBreakdown = breakdownMethodArn(event.methodArn);

    const decodedToken = await authenticate(event);

    const userId = decodedToken.sub;

    const roles = decodedToken['https://townhub.ca/profile'].roles;
    const permissionList = filterPermissionsForAction(
      getPermissionsForRoles(roles),
      arnBreakdown.namespace
    );

    // If there are enough permissions to acces this endpoint
    if (permissionList.length > 0) {
      return {
        principalId: userId,
        policyDocument: generatePolicyDocument(true, event.methodArn),
        // Pass the list of permissions as context to the function handler
        context: { userId, permissions: JSON.stringify(permissionList) },
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
