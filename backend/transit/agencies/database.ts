import { DatabaseTable } from 'core/database';
import { Agency } from './interfaces';

export const DEFAULT_AGENCIES_TABLE_NAME = 'agencies';

type Database = {
  [DEFAULT_AGENCIES_TABLE_NAME]: Agency;
};

export class AgenciesTable extends DatabaseTable<
  Database,
  typeof DEFAULT_AGENCIES_TABLE_NAME
> {
  constructor() {
    super(DEFAULT_AGENCIES_TABLE_NAME);
  }
}
