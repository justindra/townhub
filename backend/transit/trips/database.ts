import { DatabaseTable } from '../../core/database';
import { Trip } from './interfaces';

export const DEFAULT_TRIPS_TABLE_NAME = 'trips';

type Database = {
  [DEFAULT_TRIPS_TABLE_NAME]: Trip;
};

export class TripsTable extends DatabaseTable<
  Database,
  typeof DEFAULT_TRIPS_TABLE_NAME
> {
  constructor() {
    super(DEFAULT_TRIPS_TABLE_NAME);
  }
}
