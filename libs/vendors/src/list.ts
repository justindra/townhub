import { ValidationException } from '@townhub-libs/core';
import { VendorsDatabase } from './database';
import { VendorCategory } from './interfaces';
import { isValidCategory } from './utils';

/**
 * List all the vendors in the town
 * @param townId The town to list
 */
export const list = async (townId: string) => {
  const VendorsClient = new VendorsDatabase();
  return VendorsClient.listByTown(townId);
};

/**
 * List all the vendors in the town in a category
 * @param townId The town to list
 * @param category The category to filter by
 */
export const listByCategory = async (townId: string, category: string) => {
  if (!isValidCategory(category)) {
    throw new ValidationException(`The category ${category} is not valid.`);
  }
  const VendorsClient = new VendorsDatabase();
  return VendorsClient.query({
    FilterExpression: '#townId = :townId AND contains (#categories, :category)',
    ExpressionAttributeNames: {
      '#townId': 'townId',
      '#categories': 'categories',
    },
    ExpressionAttributeValues: {
      ':townId': townId,
      ':category': category,
    },
  });
};

/**
 * List all the towns that are owned by a particular user
 * @param userId The id of the user to list
 */
export const listByUserId = async (userId: string) => {
  const VendorsClient = new VendorsDatabase();
  return VendorsClient.query({
    FilterExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  });
};
