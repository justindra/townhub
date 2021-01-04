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
    const roles = decodedToken['https://townhub.ca/profile'].roles;

    const permissionList = filterPermissionsForAction(
      getPermissionsForRoles(roles),
      arnBreakdown.namespace
    );
  
    return {
      principalId: decodedToken.sub,
      policyDocument: generatePolicyDocument(
        permissionList.length > 0,
        event.methodArn
      ),
      // Pass the list of permissions as context to the function handler
      // TODO: pass the userId, etc.
      context: { permissions: JSON.stringify(permissionList) },
    };
  } catch (err) {
    console.log('err', err);
    return Promise.reject((err as Error).message);
  }
};
