import { Database } from '../../base/database';
import { Stop, Route, Schedule, DailyData } from './interfaces';

export class StopDatabase extends Database<Stop> {
  constructor() {
    super('SHUTTLE_STOP_DATABASE_NAME');
  }
}

export class RouteDatabase extends Database<Route> {
  constructor() {
    super('SHUTTLE_ROUTE_DATABASE_NAME');
  }
}

export class ScheduleDatabase extends Database<Schedule> {
  constructor() {
    super('SHUTTLE_SCHEDULE_DATABASE_NAME');
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
    super('SHUTTLE_SCHEDULE_DATABASE_NAME');
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
