import 'jest-dynalite/withDb';
import { BaseEntity, Database } from './database';
import { NotFoundException } from './exceptions';

type Item = BaseEntity & { name: string };
const DBClient = new Database<Item>('TEST_TABLE_NAME');
const actorId = 'test-user';

describe('Database', () => {
  describe('instantiation', () => {
    it('should warn when the tablename is not set or is empty string', () => {
      var warn = jest.spyOn(global.console, 'warn');
      new Database('');
      expect(warn).toHaveBeenCalled();

      // Cleanup
      warn.mockReset();
      warn.mockRestore();
    });
  });
  describe('create', () => {
    it('should add a new item with the correct audit details', async () => {
      const res = await DBClient.create({ name: 'Test Name' }, actorId);

      expect(res.id).toBeDefined();
      expect(res.created_at).toBeDefined();
      expect(res.updated_at).toBeDefined();
      expect(res.created_by).toEqual(actorId);
      expect(res.updated_by).toEqual(actorId);
    });
  });

  describe('get', () => {
    it('should return the item if it exists', async () => {
      const added = await DBClient.create({ name: 'test-123' }, actorId);
      const found = await DBClient.get(added.id);

      expect(found).toEqual(added);
    });
    it('should throw a NotFoundException if the item is missing', async () => {
      let res: Item | null = null;
      try {
        res = await DBClient.get('missing-id');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
      expect(res).toBeNull();
    });
  });

  describe('update', () => {
    it('should replace the audit fields and details', async () => {
      const user = 'user-1';
      const existing = await DBClient.create({ name: 'test-123' }, actorId);
      const updated = await DBClient.update(
        existing.id,
        { name: 'hello-123' },
        user
      );

      expect(updated.name).toEqual('hello-123');
      expect(updated.updated_at).not.toEqual(existing.updated_at);
      expect(updated.updated_by).toEqual(user);
    });
  });

  describe('delete', () => {
    it('should delete an existing item', async () => {
      const existing = await DBClient.create({ name: 'test-123' }, actorId);
      expect(await DBClient.get(existing.id)).toEqual(existing);
      await DBClient.delete(existing.id);
      try {
        await DBClient.get(existing.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('hydrate', () => {
    it('return all matching ids', async () => {
      const existingItems = await Promise.all([
        DBClient.create({ name: 'test-123' }, actorId),
        DBClient.create({ name: 'test-456' }, actorId),
        DBClient.create({ name: 'test-789' }, actorId),
      ]);

      const existingIds = existingItems.map((val) => val.id);

      const hydrated = await DBClient.hydrate([existingIds[0], existingIds[1]]);

      expect(hydrated.length).toEqual(2);
      expect(hydrated.map((val) => val.id).sort()).toEqual(
        [existingIds[0], existingIds[1]].sort()
      );
    });

    it('throws if an error occurs', async () => {
      try {
        await DBClient.hydrate(['test-2', 'test-4']);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
