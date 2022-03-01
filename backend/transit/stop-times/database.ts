import { DatabaseTable } from '../../core/database';
import { StopTime } from './interfaces';

export const DEFAULT_STOP_TIMES_TABLE_NAME = 'stop_times';

type Database = {
  [DEFAULT_STOP_TIMES_TABLE_NAME]: StopTime;
};

export class StopTimesTable extends DatabaseTable<
  Database,
  typeof DEFAULT_STOP_TIMES_TABLE_NAME
> {
  constructor() {
    super(DEFAULT_STOP_TIMES_TABLE_NAME);
  }
}
