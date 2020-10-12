import { DEFAULT_TIMEZONE, getDayDateRange } from '../../helpers';
import {
  DailyScheduleDatabase,
  RouteDatabase,
  ScheduleDatabase,
  StopDatabase,
} from './database';
import uniq from 'lodash.uniq';
import {
  generateStopSchedulesForDate,
  getStopIdsFromRouteList,
} from './helpers';

/**
 * Get a single day's worth of data
 * @param townId The town to check
 * @param timestamp The timestamp to signify which day it is
 * @param timezone The timezone we are performing the calculations on
 */
export const getDailyData = async (
  townId: string,
  timestamp: number,
  timezone: string = DEFAULT_TIMEZONE
) => {
  const DailySchedule = new DailyScheduleDatabase();
  const Schedule = new ScheduleDatabase();
  const Route = new RouteDatabase();
  const Stop = new StopDatabase();

  // Get the date ranges
  const {
    startOfDayValue,
    middleOfDay,
    middleOfDayValue,
    endOfDayValue,
  } = getDayDateRange(timestamp, timezone);
  // Check if daily data already exists and just return that if it does
  const availableDailySchedules = await DailySchedule.getByTimestamp(
    middleOfDayValue,
    townId
  );
  if (availableDailySchedules.length) return availableDailySchedules[0];

  // Get all schedules for today
  const schedules = await Schedule.getByTimestamp(
    startOfDayValue,
    endOfDayValue,
    townId
  );

  // Get all routes based on the schedule
  const routeIds = uniq(schedules.map((schedule) => schedule.routeId));
  const routes = await Route.hydrate(routeIds);

  // Get all stops based on routes
  const stopIds = getStopIdsFromRouteList(routes);
  const stops = await Stop.hydrate(stopIds);

  const stopSchedules = generateStopSchedulesForDate(
    schedules,
    routes,
    stops,
    middleOfDay
  );

  const newDailySchedule = await DailySchedule.create({
    townId,
    timestamp: middleOfDayValue,
    stops: stopSchedules,
    schedules,
    routes: routes,
  });

  return newDailySchedule;
};
