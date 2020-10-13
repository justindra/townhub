import {
  Route,
  RouteStop,
  RouteStopDepartureTime,
  Schedule,
  Stop,
  StopSchedule,
} from '../interfaces';
import { DateTime } from 'luxon';
import uniq from 'lodash.uniq';
import { sortNumberAscending } from '../../../helpers';

/**
 * Get the list of Stop Ids being used in a given list of routes
 * @param routes The list of routes to use
 */
export const getStopIdsFromRouteList = (routes: Route[]): string[] => {
  const stopIds: string[] = [];
  routes.forEach((route) => {
    route.stopList.forEach((routeStop) => stopIds.push(routeStop.stopId));
  });
  return uniq(stopIds);
};

/**
 * Get the scheduled start times for a particular day of the week based on a
 * given schedule
 * @param schedule The schedule to use
 * @param dayOfWeek The day of the week (number between 1 (Mon) to  7 (Sun))
 */
export const getScheduleStartTimesForDayOfWeek = (
  schedule: Schedule,
  dayOfWeek: number
) => {
  const startTimes = schedule.startTimes
    // Filter the start times by the actual day of the week we need
    .filter((val) => val.daysInOperation.includes(dayOfWeek))
    // Return just the start time
    .map((val) => val.startTimeMinutes)
    // Sort it from earliest to latest
    .sort(sortNumberAscending);

  return uniq(startTimes);
};

/**
 * Get a list of departure times based on the given startTime and a list of
 * stops which should include the legTime
 * @param startTime The time the route starts
 * @param stopList The list of stops to use
 */
export const getDepartureTimesFromStopList = (
  startTime: number,
  stopList: RouteStop[]
): RouteStopDepartureTime[] => {
  // Initialize the departure times array
  const departureTimes: RouteStopDepartureTime[] = [];

  // Initialize the time
  let time = startTime;
  // For each stop, we add the leg time and then add it to the array list
  for (const routeStop of stopList) {
    time += routeStop.legMinutes;
    departureTimes.push({
      stopId: routeStop.stopId,
      departureTimeMinutes: time,
    });
  }

  return departureTimes;
};

export const generateStopSchedulesForDate = (
  schedules: Schedule[],
  routes: Route[],
  stops: Stop[],
  timestamp: DateTime
): StopSchedule[] => {
  // Get the day of the week to use based on timestamp
  const dayOfWeek = timestamp.weekday;

  // Initialize the object to save details in
  const stopScheduleByStopId: { [stopId: string]: StopSchedule } = {};

  // Run this for each schedule
  schedules.forEach((schedule) => {
    const route = routes.find((val) => val.id === schedule.routeId);

    if (!route) {
      console.warn(
        `Route with id: ${schedule.routeId} was not provided, ignoring`
      );
      return;
    }

    const startTimesToUse = getScheduleStartTimesForDayOfWeek(
      schedule,
      dayOfWeek
    );

    startTimesToUse.forEach((startTime) => {
      // Get departure time function
      const departureTimes = getDepartureTimesFromStopList(
        startTime,
        route.stopList
      );

      // Update the stopScheduleByStopId object
      departureTimes.forEach(({ stopId, departureTimeMinutes }) => {
        if (!stopScheduleByStopId[stopId]) {
          const stopDetails = stops.find((val) => val.id === stopId);
          if (!stopDetails) {
            console.warn(`Stop with id: ${stopId} was not provided, ignoring`);
            return;
          }
          stopScheduleByStopId[stopId] = {
            ...stopDetails,
            scheduleDate: timestamp.valueOf(),
            schedule: {},
          };
        }

        // Add the new time and sort it by ascending
        const newSchedule = [
          ...(stopScheduleByStopId[stopId].schedule[route.id] ?? []),
          departureTimeMinutes,
        ].sort(sortNumberAscending);

        // Assign it back in
        stopScheduleByStopId[stopId].schedule[route.id] = newSchedule;
      });
    });
  });

  return Object.values(stopScheduleByStopId);
};
