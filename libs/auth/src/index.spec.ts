import { Namespace } from './base';
import { filterPermissionsForAction, getPermissionsForRoles } from './index';

describe('Auth helpers', () => {
  describe('getPermissionsForRoles', () => {
    it('returns the correct uniq list', () => {
      expect(getPermissionsForRoles(['public'])).toEqual(['vendors:read:all']);
      expect(getPermissionsForRoles(['user'])).toEqual([
        'vendors:read:all',
        'vendors:create:all',
        'vendors:update:own',
        'vendors:delete:own',
      ]);
    });
  });
  describe('filterPermissionsForAction', () => {
    it('returns the correct list of permissions', () => {
      const permissionList = [
        'vendors:read:all',
        'vendors:create:all',
        'vendors:update:own',
        'vendors:delete:own',
        'other:create:own',
        'other:create:all',
      ];
      expect(
        filterPermissionsForAction(permissionList, 'vendors', 'create')
      ).toEqual(['vendors:create:all']);
      expect(filterPermissionsForAction(permissionList, 'vendors')).toEqual([
        'vendors:read:all',
        'vendors:create:all',
        'vendors:update:own',
        'vendors:delete:own',
      ]);
      expect(
        filterPermissionsForAction(
          permissionList,
          'other' as Namespace,
          'create'
        )
      ).toEqual(['other:create:own', 'other:create:all']);
    });
  });
});
