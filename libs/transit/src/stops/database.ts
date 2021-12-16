import { Database } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { Stop } from './interfaces';

export class StopsDatabase extends Database<Stop> {
  constructor() {
    super(TransitDatabaseEnv.Stops);
  }
}
