import { PolicyDocument } from 'aws-lambda';

/**
 * Generate a Policy Document to specify whether or not to
 * allow the api call
 * @param effect Allow or Deny the call
 * @param resource The resource to call
 */
export const generatePolicyDocument = (
  effect: 'Allow' | 'Deny',
  resource: string
): PolicyDocument => {
  return {
    Version: '2012-10-17', // default version
    Statement: [
      {
        Action: 'execute-api:Invoke', // default action
        Effect: effect,
        Resource: resource,
      },
    ],
  };
};
