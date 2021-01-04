import uniq from 'lodash.uniq';
import { Action, Namespace, UserRole } from './base';
import { VENDORS_PERMISSIONS } from './vendors';
import { TESTS_PERMISSIONS } from './test-service';

/**
 * Get the full list of permissions given a set of roles
 * @param roles The roles the user has
 */
export const getPermissionsForRoles = (roles: UserRole[]): string[] => {
  const list: string[] = [];
  roles.forEach((role) => {
    // Set the vendors permissions
    list.push(...VENDORS_PERMISSIONS[role]);
    list.push(...TESTS_PERMISSIONS[role]);
  });
  return uniq(list);
};

/**
 * Filter a list of permissions based on a provided namespace and action
 *
 * This allows us to check whether or not a user can perform certain actions
 * @param permissionList The list of permissions a user has
 * @param namespace The namespace to check for
 * @param action The action to check for
 */
export const filterPermissionsForAction = (
  permissionList: string[],
  namespace: Namespace,
  action?: Action
): string[] => {
  return permissionList.filter((val) =>
    val.startsWith(`${namespace}:${action || ''}`)
  );
};

export { UserRole, Namespace, Action };
