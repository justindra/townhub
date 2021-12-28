import { Database } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { STOP_ENTITY_TYPE, Stop } from './interfaces';

export class StopsDatabase extends Database<Stop> {
  constructor() {
    super(TransitDatabaseEnv.Stops, STOP_ENTITY_TYPE);
  }
}
