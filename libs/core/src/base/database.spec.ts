import 'jest-dynalite/withDb';
import { Database } from './database';

const DBClient = new Database('TEST_TABLE_NAME');

describe('Database', () => {
  it('should add a new item with the correct audit details', async () => {
    const actorId = 'test-user';
    const res = await DBClient.create({ name: 'Test Name' }, actorId);

    expect(res.id).toBeDefined();
    expect(res.created_at).toBeDefined();
    expect(res.updated_at).toBeDefined();
    expect(res.created_by).toEqual(actorId);
    expect(res.updated_by).toEqual(actorId);
  });
});
