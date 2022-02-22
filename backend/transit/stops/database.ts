import { DatabaseTable } from 'core/database';
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

export class StopsTable extends DatabaseTable<Stop, DatabaseStop> {
  constructor() {
    super(DEFAULT_STOPS_TABLE_NAME);
  }

  beforeDBTransform(item: Partial<Stop>): DatabaseStop {
    const res: DatabaseStop = {
      ...item,
    } as DatabaseStop;

    // Remove the latitude and longitude as that is never actually saved in the
    // database.
    delete (res as any).lat;
    delete (res as any).lon;

    // If both the latitude and longitude was set, then make sure we set the
    // location with the point
    if (item.lat && item.lon) {
      res.location = `(${item.lon},${item.lat})`;
    }

    // Convert to make sure we have the longitude and latitude as a point
    return res;
  }

  afterDBTransform(stop: DatabaseStop): Stop {
    // Convert the location saved as latitude and longitude
    const { lon, lat } = convertPointStringToPoint(stop.location);
    return {
      ...stop,
      lon,
      lat,
    };
  }
}
