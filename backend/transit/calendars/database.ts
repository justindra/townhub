import { DatabaseTable } from 'core/database';
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
}
