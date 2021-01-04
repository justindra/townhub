/** 
 * Had to name it test-service.ts as test.ts triggers jest to think that this
 * is a test
 */
import { generatePermission, ROLES, TEST } from './base';

export const TESTS_AVAILABLE_PERMISSIONS = {
  auth: generatePermission(TEST, 'read', 'all'),
};

export const TESTS_PERMISSIONS = {
  [ROLES.PUBLIC]: [],
  [ROLES.USER]: [TESTS_AVAILABLE_PERMISSIONS.auth],
};
