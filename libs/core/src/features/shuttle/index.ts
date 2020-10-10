import { StopSchedule } from './interfaces';
import { DEFAULT_TIMEZONE, getDayDateRange } from '../../helpers';
import {
  DailyScheduleDatabase,
  RouteDatabase,
  ScheduleDatabase,
} from './database';
import uniq from 'lodash.uniq';

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

  // Get the date ranges
  const { startOfDay, middleOfDay, endOfDay } = getDayDateRange(
    timestamp,
    timezone
  );
  // Check if daily data already exists and just return that if it does
  const availableDailySchedules = await DailySchedule.getByTimestamp(
    middleOfDay,
    townId
  );
  if (availableDailySchedules.length) return availableDailySchedules[0];

  // Get all schedules for today
  const schedules = await Schedule.getByTimestamp(startOfDay, endOfDay, townId);

  // Get all routes based on the schedule
  const routeIds = uniq(schedules.map((schedule) => schedule.routeId));
  const routes = await Route.hydrate(routeIds);

  const newDailySchedule = await DailySchedule.create({
    townId,
    timestamp: middleOfDay,
    stops: [],
    schedules,
    routes: [],
  });

  return newDailySchedule;
};

export const generateStopSchedulesForToday = (): StopSchedule[] => {
  // Find all schedules for today
  // Go through each route and work out different times
  // for each stop that is being used today and then save that in the database
  // so that we can get the stop for today.
  return [];
};
