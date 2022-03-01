import { Selectable, sql, Updateable } from 'kysely';
import { DatabaseTable } from '../../core/database';
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

  beforeDBTransform(item: Selectable<Route>) {
    const res: Updateable<Route> = {
      ...item,
    } as any;

    if (item.agency_id) {
      // Cast as a UUID
      res.agency_id = sql`${item.agency_id}::uuid` as any;
    }

    return res as any;
  }
}
