import { Selectable, sql, Updateable } from 'kysely';
import { DatabaseTable } from '../../core/database';
import { Calendar } from './interfaces';

export const DEFAULT_CALENDARS_TABLE_NAME = 'calendars';

type Database = {
  [DEFAULT_CALENDARS_TABLE_NAME]: Calendar;
};

export class CalendarsTable extends DatabaseTable<
  Database,
  typeof DEFAULT_CALENDARS_TABLE_NAME
> {
  constructor() {
    super(DEFAULT_CALENDARS_TABLE_NAME);
  }

  beforeDBTransform(item: Selectable<Calendar>) {
    const res: Updateable<Calendar> = {
      ...item,
    } as any;

    if (item.start_date) {
      // Cast as a date
      res.start_date = sql`${item.start_date}::date` as any;
    }

    if (item.end_date) {
      // Cast as a date
      res.end_date = sql`${item.end_date}::date` as any;
    }

    return res as any;
  }
}
