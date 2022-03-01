import { DatabaseTable } from '../../core/database';
import { Point } from '../../core/interfaces';
import { Selectable, sql, Updateable } from 'kysely';
import { Stop } from './interfaces';

export const DEFAULT_STOPS_TABLE_NAME = 'stops';

type Database = {
  [DEFAULT_STOPS_TABLE_NAME]: Stop;
};

export class StopsTable extends DatabaseTable<
  Database,
  typeof DEFAULT_STOPS_TABLE_NAME
> {
  constructor() {
    super(DEFAULT_STOPS_TABLE_NAME);
  }

  beforeDBTransform(item: Selectable<Stop>) {
    const res: Updateable<Database[typeof DEFAULT_STOPS_TABLE_NAME]> = {
      ...item,
    } as any;

    // If both the latitude and longitude was set, then make sure we set the
    // location with the point
    if (item.point) {
      if (typeof item.point === 'string') {
        res.point = sql`${item.point}` as any;
      } else if (typeof item.point === 'object') {
        res.point = sql`point(${(item.point as Point).lon},${
          (item.point as Point).lat
        })` as any;
      }
    }

    // Convert to make sure we have the longitude and latitude as a point
    return res as any;
  }
}
