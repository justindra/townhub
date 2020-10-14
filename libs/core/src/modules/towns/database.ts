import { Database } from '../../base/database';
import { Town } from './interfaces';

const TOWNS_DATABASE = {
  ENV: 'TOWNS_DATABASE_NAME',
  CF_OUTPUT: 'TownsTableName',
};

export class TownsDatabase extends Database<Town> {
  constructor() {
    super(TOWNS_DATABASE.ENV);
  }
}
