import { Database } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { Route } from './interfaces';

export class RoutesDatabase extends Database<Route> {
  constructor() {
    super(TransitDatabaseEnv.Routes);
  }
}
