import { generatePermission, ROLES, TEST } from './base';

export const TESTS_AVAILABLE_PERMISSIONS = {
  auth: generatePermission(TEST, 'read'),
};

export const TESTS_PERMISSIONS = {
  [ROLES.PUBLIC]: [],
  [ROLES.USER]: [TESTS_AVAILABLE_PERMISSIONS.auth],
};
