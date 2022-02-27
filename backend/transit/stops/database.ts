import { DatabaseTable } from 'core/database';
import { Selectable, sql, Updateable } from 'kysely';
import { Stop } from './interfaces';

export const DEFAULT_STOPS_TABLE_NAME = 'stops';

const convertPointStringToPoint = (location: string) => {
  const parts = location.replace('(', '').replace(')', '').split(',');
  return {
    lon: parseFloat(parts[0]),
    lat: parseFloat(parts[1]),
  };
};

type DatabaseStop = Omit<Stop, 'lon' | 'lat'> & {
  location: string;
};

type Database = {
  [DEFAULT_STOPS_TABLE_NAME]: DatabaseStop;
};

export class StopsTable extends DatabaseTable<
  Database,
  typeof DEFAULT_STOPS_TABLE_NAME,
  Stop
> {
  constructor() {
    super(DEFAULT_STOPS_TABLE_NAME);
  }

  beforeDBTransform(item: Stop) {
    const res: Updateable<Database[typeof DEFAULT_STOPS_TABLE_NAME]> = {
      ...item,
    } as any;

    // Remove the latitude and longitude as that is never actually saved in the
    // database.
    delete (res as any).lat;
    delete (res as any).lon;

    // If both the latitude and longitude was set, then make sure we set the
    // location with the point
    if (item.lat && item.lon) {
      res.location = sql`point(${item.lon},${item.lat})` as any;
    }

    // Convert to make sure we have the longitude and latitude as a point
    return res as any;
  }

  afterDBTransform(stop: Selectable<DatabaseStop>): Stop {
    // Convert the location saved as latitude and longitude
    const { lon, lat } = convertPointStringToPoint(stop.location);
    const res = { ...stop, lon, lat };
    delete (res as any).location;
    return res as any as Stop;
  }
}
