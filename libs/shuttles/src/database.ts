import { BaseModuleDatabase } from '@townhub-libs/modules';
import { SHUTTLES_DATABASES } from './constants';
import { Stop, Route, Schedule, DailyData } from './interfaces';

export class StopsDatabase extends BaseModuleDatabase<Stop> {
  constructor() {
    super(SHUTTLES_DATABASES.STOP.ENV, SHUTTLES_DATABASES.STOP.ENTITY_TYPE);
  }
}

export class RoutesDatabase extends BaseModuleDatabase<Route> {
  constructor() {
    super(SHUTTLES_DATABASES.ROUTE.ENV, SHUTTLES_DATABASES.ROUTE.ENTITY_TYPE);
  }
}

export class SchedulesDatabase extends BaseModuleDatabase<Schedule> {
  constructor() {
    super(
      SHUTTLES_DATABASES.SCHEDULE.ENV,
      SHUTTLES_DATABASES.SCHEDULE.ENTITY_TYPE
    );
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
    return this.search({
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
export class DailySchedulesDatabase extends BaseModuleDatabase<DailyData> {
  constructor() {
    super(
      SHUTTLES_DATABASES.DAILY_SCHEDULE.ENV,
      SHUTTLES_DATABASES.DAILY_SCHEDULE.ENTITY_TYPE
    );
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
    return this.search({
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
