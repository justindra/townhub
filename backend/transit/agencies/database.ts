import { DatabaseTable } from 'core/database';
import { Agency } from './interfaces';

export const DEFAULT_AGENCIES_TABLE_NAME = 'agencies';

export class AgenciesTable extends DatabaseTable<Agency> {
  constructor() {
    super(DEFAULT_AGENCIES_TABLE_NAME);
  }
}
