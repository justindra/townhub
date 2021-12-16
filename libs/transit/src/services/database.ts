import { Database } from '@townhub-libs/core';
import { TransitDatabaseEnv } from '../constants';
import { Service } from './interfaces';

export class ServicesDatabase extends Database<Service> {
  constructor() {
    super(TransitDatabaseEnv.Services);
  }
}
