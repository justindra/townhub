import 'jest-dynalite/withDb';
import { AgenciesDatabase } from './database';

const AgenciesClient = new AgenciesDatabase();

describe('Agencies Database', () => {
  it('should add a new item', async () => {
    const res = await AgenciesClient.create(
      {
        name: 'Test Name',
        url: 'https://hello.com',
        timezone: 'America/Los_Angeles',
      },
      'test-user'
    );

    console.log(res);
    expect(res.id).not.toEqual('');
  });
});
