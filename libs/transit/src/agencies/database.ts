import { Database } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { AGENCY_ENTITY_TYPE, Agency } from './interfaces';

export class AgenciesDatabase extends Database<Agency> {
  constructor() {
    super(TransitDatabaseEnv.Agencies, AGENCY_ENTITY_TYPE);
  }
}
