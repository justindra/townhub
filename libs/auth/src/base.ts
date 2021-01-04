export const ROLES = {
  USER: 'user' as const,
  PUBLIC: 'public' as const,
};
export type UserRole = typeof ROLES.USER | typeof ROLES.PUBLIC;

export const VENDORS = 'vendors';
export const TEST = 'test/auth';

export type Namespace = typeof VENDORS | typeof TEST;
export type Action = 'create' | 'read' | 'update' | 'delete';
export type Ownership = 'all' | 'own';

export const generatePermission = (
  namespace: Namespace,
  action: Action,
  ownership: Ownership = 'all'
) => `${namespace}:${action}:${ownership}`;
