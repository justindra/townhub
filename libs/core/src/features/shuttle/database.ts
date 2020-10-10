import { Database } from '../../base/database';
import { Stop, Route, Schedule } from './interfaces';

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
}
