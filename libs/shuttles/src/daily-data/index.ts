import {
  DEFAULT_ACTOR_ID,
  DEFAULT_TIMEZONE,
  getDate,
  getDayDateRange,
} from '@townhub-libs/core';
import {
  DailySchedulesDatabase,
  RoutesDatabase,
  SchedulesDatabase,
  StopsDatabase,
} from '../database';
import uniq from 'lodash.uniq';
import {
  convertRoutesToDailyDataRoutes,
  filterStartTimesByDayOfWeek,
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
  timezone: string = DEFAULT_TIMEZONE,
  actorId: string = DEFAULT_ACTOR_ID
) => {
  const DailySchedules = new DailySchedulesDatabase();
  const Schedules = new SchedulesDatabase();
  const Routes = new RoutesDatabase();
  const Stops = new StopsDatabase();

  // Get the date ranges
  const { startOfDayValue, middleOfDay, endOfDayValue } = getDayDateRange(
    timestamp,
    timezone
  );
  const dateString = getDate(timestamp, timezone);

  // Check if daily data already exists and just return that if it does
  const availableDailySchedules = await DailySchedules.getByTimestamp(
    dateString,
    townId
  );
  if (availableDailySchedules.length) return availableDailySchedules[0];

  // Get all schedules for today (filtered by the day-of-week it is in operation)
  const schedules = (
    await Schedules.getByTimestamp(startOfDayValue, endOfDayValue, townId)
  ).filter((schedule) => {
    return schedule.startTimes.filter(
      filterStartTimesByDayOfWeek(middleOfDay.weekday)
    ).length;
  });

  // Get all routes based on the schedule
  const routeIds = uniq(schedules.map((schedule) => schedule.routeId));
  const routes = await Routes.hydrate(routeIds);

  // Get all stops based on routes
  const stopIds = getStopIdsFromRouteList(routes);
  const stops = await Stops.hydrate(stopIds);

  const dailyDataRoutes = convertRoutesToDailyDataRoutes(routes, stops);
  const stopSchedules = generateStopSchedulesForDate(
    schedules,
    routes,
    stops,
    middleOfDay
  );

  const newDailySchedule = await DailySchedules.create(
    {
      townId,
      // TODO: Update this to get a proper moduleId once we have
      // it saved
      moduleId: 'test',
      timestamp: dateString,
      stops: stopSchedules,
      schedules,
      routes: dailyDataRoutes,
    },
    actorId
  );

  return newDailySchedule;
};
