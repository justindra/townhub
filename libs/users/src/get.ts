import { UsersDatabase } from './database';

/**
 * Get a userId by a given sub from one of the Authorizing Applications
 * @param sub The sub to use
 */
export const getUserBySub = async (sub: string) => {
  const UsersClient = new UsersDatabase();

  // Find an existing user with that sub
  const res = await UsersClient.query({
    FilterExpression: 'contains (#subs, :sub)',
    ExpressionAttributeNames: {
      '#subs': 'subs',
    },
    ExpressionAttributeValues: {
      ':sub': sub,
    },
  });

  // If it exists, then return it
  if (res.length) {
    return res[0];
  }

  // Otherwise create a new user with that sub
  return await UsersClient.create({
    subs: [sub],
  });
};
