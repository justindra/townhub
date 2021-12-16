import { Database } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { Trip } from './interfaces';

export class TripsDatabase extends Database<Trip> {
  constructor() {
    super(TransitDatabaseEnv.Trips);
  }
}
