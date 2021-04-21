import { Database } from '@townhub-libs/core';
import { User } from './interfaces';

export const USERS_DATABASE = {
  ENV: 'USERS_DATABASE_NAME',
  CF_OUTPUT: 'UsersTableName',
};

export class UsersDatabase extends Database<User> {
  constructor() {
    super(USERS_DATABASE.ENV);
  }
}
