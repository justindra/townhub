import { Database } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { DailyTransitData } from './interfaces';

export class DailyDataDatabase extends Database<DailyTransitData> {
  constructor() {
    super(TransitDatabaseEnv.DailyData);
  }
}
