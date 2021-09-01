// TODO: This is just a stub for now, but all Lambda Source Code should be
// saved in here
import { Handler } from 'aws-lambda';

export const HELLO = 'WORLD';

/**
 * Test handler
 */
export const main: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello this works???',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};
