import { BaseEntity, Database } from '@townhub-libs/core';
import { Stop, Route, Schedule, DailyData } from './interfaces';

export const SHUTTLES_DATABASES = {
  STOP: {
    ENV: 'SHUTTLE_STOPS_DATABASE_NAME',
    CF_OUTPUT: 'StopsTableName',
  },
  ROUTE: {
    ENV: 'SHUTTLE_ROUTES_DATABASE_NAME',
    CF_OUTPUT: 'RoutesTableName',
  },
  SCHEDULE: {
    ENV: 'SHUTTLE_SCHEDULES_DATABASE_NAME',
    CF_OUTPUT: 'SchedulesTableName',
  },
  DAILY_SCHEDULE: {
    ENV: 'SHUTTLE_DAILY_SCHEDULES_DATABASE_NAME',
    CF_OUTPUT: 'DailySchedulesTableName',
  },
};

class DatabaseWithTown<TItem extends BaseEntity> extends Database<TItem> {
  async listByTown(townId: string) {
    return this.query({
      FilterExpression: '#townId = :townId',
      ExpressionAttributeNames: {
        '#townId': 'townId',
      },
      ExpressionAttributeValues: {
        ':townId': townId,
      },
    });
  }
}

export class StopsDatabase extends DatabaseWithTown<Stop> {
  constructor() {
    super(SHUTTLES_DATABASES.STOP.ENV);
  }
}

export class RoutesDatabase extends DatabaseWithTown<Route> {
  constructor() {
    super(SHUTTLES_DATABASES.ROUTE.ENV);
  }
}

export class SchedulesDatabase extends DatabaseWithTown<Schedule> {
  constructor() {
    super(SHUTTLES_DATABASES.SCHEDULE.ENV);
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
export class DailySchedulesDatabase extends Database<DailyData> {
  constructor() {
    super(SHUTTLES_DATABASES.DAILY_SCHEDULE.ENV);
  }

  /**
   * Get a daily schedule based on the timestamp
   * @param timestamp The timestamp (YYYY-MM-DD)
   * @param townId The town id to check
   */
  async getByTimestamp(timestamp: string, townId: string = '') {
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
