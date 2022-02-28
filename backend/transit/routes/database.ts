import { DatabaseTable } from 'core/database';
import { Route } from './interfaces';

export const DEFAULT_ROUTES_TABLE_NAME = 'routes';

type Database = {
  [DEFAULT_ROUTES_TABLE_NAME]: Route;
};

export class RoutesTable extends DatabaseTable<
  Database,
  typeof DEFAULT_ROUTES_TABLE_NAME
> {
  constructor() {
    super(DEFAULT_ROUTES_TABLE_NAME);
  }
}
