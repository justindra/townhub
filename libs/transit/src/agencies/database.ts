import { Database } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { Agency } from './interfaces';

export class AgenciesDatabase extends Database<Agency> {
  constructor() {
    super(TransitDatabaseEnv.Agencies);
  }
}
