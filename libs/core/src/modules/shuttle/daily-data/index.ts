import { DEFAULT_TIMEZONE, getDayDateRange } from '../../../helpers';
import {
  DailySchedulesDatabase,
  RoutesDatabase,
  SchedulesDatabase,
  StopsDatabase,
} from '../database';
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
  const DailySchedules = new DailySchedulesDatabase();
  const Schedules = new SchedulesDatabase();
  const Routes = new RoutesDatabase();
  const Stops = new StopsDatabase();

  // Get the date ranges
  const {
    startOfDayValue,
    middleOfDay,
    middleOfDayValue,
    endOfDayValue,
  } = getDayDateRange(timestamp, timezone);
  // Check if daily data already exists and just return that if it does
  const availableDailySchedules = await DailySchedules.getByTimestamp(
    middleOfDayValue,
    townId
  );
  if (availableDailySchedules.length) return availableDailySchedules[0];

  // Get all schedules for today
  const schedules = await Schedules.getByTimestamp(
    startOfDayValue,
    endOfDayValue,
    townId
  );

  // Get all routes based on the schedule
  const routeIds = uniq(schedules.map((schedule) => schedule.routeId));
  const routes = await Routes.hydrate(routeIds);

  // Get all stops based on routes
  const stopIds = getStopIdsFromRouteList(routes);
  const stops = await Stops.hydrate(stopIds);

  const stopSchedules = generateStopSchedulesForDate(
    schedules,
    routes,
    stops,
    middleOfDay
  );

  const newDailySchedule = await DailySchedules.create({
    townId,
    timestamp: middleOfDayValue,
    stops: stopSchedules,
    schedules,
    routes: routes,
  });

  return newDailySchedule;
};
