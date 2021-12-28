import { Database } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { ROUTE_ENTITY_TYPE, Route } from './interfaces';

export class RoutesDatabase extends Database<Route> {
  constructor() {
    super(TransitDatabaseEnv.Routes, ROUTE_ENTITY_TYPE);
  }
}
