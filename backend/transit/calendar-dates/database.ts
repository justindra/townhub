import { DatabaseTable } from '../../core/database';
import { CalendarDate } from './interfaces';

export const DEFAULT_CALENDAR_DATES_TABLE_NAME = 'calendar_dates';

type Database = {
  [DEFAULT_CALENDAR_DATES_TABLE_NAME]: CalendarDate;
};

export class CalendarDatesTable extends DatabaseTable<
  Database,
  typeof DEFAULT_CALENDAR_DATES_TABLE_NAME
> {
  constructor() {
    super(DEFAULT_CALENDAR_DATES_TABLE_NAME);
  }
}
