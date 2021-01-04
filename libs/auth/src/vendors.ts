import { generatePermission, ROLES, VENDORS } from './base';

export const VENDORS_AVAILABLE_PERMISSIONS = {
  create: generatePermission(VENDORS, 'create'),
  read: generatePermission(VENDORS, 'read'),
  update: generatePermission(VENDORS, 'update', 'own'),
  delete: generatePermission(VENDORS, 'delete', 'own'),
};

export const VENDORS_PERMISSIONS = {
  [ROLES.PUBLIC]: [VENDORS_AVAILABLE_PERMISSIONS.read],
  [ROLES.USER]: [
    VENDORS_AVAILABLE_PERMISSIONS.read,
    VENDORS_AVAILABLE_PERMISSIONS.create,
    VENDORS_AVAILABLE_PERMISSIONS.update,
    VENDORS_AVAILABLE_PERMISSIONS.delete,
  ],
};
