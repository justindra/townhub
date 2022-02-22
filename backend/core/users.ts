import { BaseEntity } from './interfaces';

export const DEFAULT_USERS_TABLE_NAME = 'users';

export type User = BaseEntity & {
  email: string;
  first_name: string;
  last_name: string;
};
