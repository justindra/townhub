import { generatePermission } from './base';

describe('Base Helpers', () => {
  describe('generatePermissions', () => {
    it('generates all permissions by default', () => {
      expect(generatePermission('vendors', 'create')).toEqual(
        'vendors:create:all'
      );
    });
    it('generates the correct permissions provided', () => {
      expect(generatePermission('vendors', 'update', 'own')).toEqual(
        'vendors:update:own'
      );
    });
  });
});
