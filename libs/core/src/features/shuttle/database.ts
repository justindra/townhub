import { Database } from '../../base/database';
import { Stop, Route, Schedule, DailyData } from './interfaces';

export const SHUTTLE_DATABASES = {
  STOP: {
    ENV: 'SHUTTLE_STOP_DATABASE_NAME',
    CF_OUTPUT: 'StopsTableName',
  },
  ROUTE: {
    ENV: 'SHUTTLE_ROUTE_DATABASE_NAME',
    CF_OUTPUT: 'RoutesTableName',
  },
  SCHEDULE: {
    ENV: 'SHUTTLE_SCHEDULE_DATABASE_NAME',
    CF_OUTPUT: 'SchedulesTableName',
  },
  DAILY_SCHEDULE: {
    ENV: 'SHUTTLE_DAILY_SCHEDULE_DATABASE_NAME',
    CF_OUTPUT: 'DailySchedulesTableName',
  },
};

export class StopDatabase extends Database<Stop> {
  constructor() {
    super(SHUTTLE_DATABASES.STOP.ENV);
  }
}

export class RouteDatabase extends Database<Route> {
  constructor() {
    super(SHUTTLE_DATABASES.ROUTE.ENV);
  }
}

export class ScheduleDatabase extends Database<Schedule> {
  constructor() {
    super(SHUTTLE_DATABASES.SCHEDULE.ENV);
  }

  /**
   * Get a schedule based on the timerange
   * @param startDate The time we start to look for
   * @param endDate The time we stop looking for
   * @param townId The town id to check
   */
  async getByTimestamp(
    startDate: number,
    endDate: number,
    townId: string = ''
  ) {
    const expressions = [
      '#startDate <= :startDate',
      '(#endDate >= :endDate OR #endDate = :endDateDefault)',
    ];
    if (townId.length) {
      expressions.push('#townId = :townId');
    }
    return this.query({
      FilterExpression: expressions.join(' AND '),
      ExpressionAttributeNames: {
        '#startDate': 'startDate',
        '#endDate': 'endDate',
        '#townId': 'townId',
      },
      ExpressionAttributeValues: {
        ':startDate': startDate,
        ':endDate': endDate,
        ':endDateDefault': -1,
        ':townId': townId,
      },
    });
  }
}
export class DailyScheduleDatabase extends Database<DailyData> {
  constructor() {
    super(SHUTTLE_DATABASES.DAILY_SCHEDULE.ENV);
  }

  /**
   * Get a daily schedule based on the timestamp
   * @param timestamp The timestamp (this should ideally be midday of that date)
   * @param townId The town id to check
   */
  async getByTimestamp(timestamp: number, townId: string = '') {
    const expressions = ['#timestamp = :timestamp'];
    if (townId.length) {
      expressions.push('#townId = :townId');
    }
    return this.query({
      FilterExpression: expressions.join(' AND '),
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
        '#townId': 'townId',
      },
      ExpressionAttributeValues: {
        ':timestamp': timestamp,
        ':townId': townId,
      },
    });
  }
}
