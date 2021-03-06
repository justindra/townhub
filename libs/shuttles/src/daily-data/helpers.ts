import {
  DailyDataRoute,
  DailyDataRouteStop,
  Route,
  RouteStop,
  RouteStopDepartureTime,
  Schedule,
  ScheduleStartTimes,
  Stop,
  StopSchedule,
} from '../interfaces';
import { DateTime } from 'luxon';
import uniqBy from 'lodash.uniqby';
import uniq from 'lodash.uniq';
import {
  DEFAULT_DATE_FORMAT,
  sortNumberAscending,
  ValidationException,
} from '@townhub-libs/core';

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
 * A filter function generator to filter the start times
 * based on the given day of the week
 * @param dayOfWeek
 */
export const filterStartTimesByDayOfWeek = (dayOfWeek: number) => (
  val: ScheduleStartTimes
) => val.daysInOperation.includes(dayOfWeek);

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
    .filter(filterStartTimesByDayOfWeek(dayOfWeek))
    // Sort it from earliest to latest
    .sort((a, b) =>
      sortNumberAscending(a.startTimeMinutes, b.startTimeMinutes)
    );

  // TODO: This currently does not take into account what happens when the same
  // startTime but with different hiddenStops or different daysInOperation
  // occurs in theory that should never exist, but its something that can happen
  return uniqBy(startTimes, 'startTimeMinutes');
};

/**
 * Get a list of departure times based on the given startTime and a list of
 * stops which should include the legTime
 * @param startTime The time the route starts
 * @param stopList The list of stops to use
 */
export const getDepartureTimesFromStopList = (
  startTime: number,
  stopList: RouteStop[],
  hiddenStops: string[] = []
): RouteStopDepartureTime[] => {
  // Initialize the departure times array
  const departureTimes: RouteStopDepartureTime[] = [];

  // Initialize the time
  let time = startTime;
  // For each stop, we add the leg time and then add it to the array list
  for (const [index, routeStop] of stopList.entries()) {
    if (hiddenStops.includes(routeStop.stopId)) {
      // Get the next route stop
      const nextRouteStop = stopList[index + 1];
      // If this is the first stop in the list, then remove the nextStops
      // minutes, to zero it back in.
      if (index === 0) {
        time -= nextRouteStop.legMinutes;
      } else {
        time += routeStop.legMinutes;
      }
      continue;
    }
    time += routeStop.legMinutes;
    departureTimes.push({
      stopId: routeStop.stopId,
      departureTimeMinutes: time,
    });
  }

  // Remove the last stop from the list as that should never have a departure
  // time as its the last stop
  departureTimes.pop();

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
        startTime.startTimeMinutes,
        route.stopList,
        startTime.hiddenStops
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
            scheduleDate: timestamp.toFormat(DEFAULT_DATE_FORMAT),
            routes: [],
          };
        }

        // Find the idx of that route in the list
        let routeIdx = stopScheduleByStopId[stopId].routes.findIndex(
          (val) => val.id === route.id
        );

        // If the route doesn't currently exist in the array then add it in
        if (routeIdx === -1) {
          const length = stopScheduleByStopId[stopId].routes.push({
            id: route.id,
            name: route.name,
            description: route.description,
            schedule: [],
          });
          routeIdx = length - 1;
        }

        // Add the new time and sort it by ascending
        const newSchedule = [
          ...stopScheduleByStopId[stopId].routes[routeIdx].schedule,
          departureTimeMinutes,
        ].sort(sortNumberAscending);

        // Assign it back in
        stopScheduleByStopId[stopId].routes[routeIdx].schedule = newSchedule;
      });
    });
  });

  return Object.values(stopScheduleByStopId);
};

/**
 * Convert the database routes to be a route list required for the daily data
 * @param routes The routes to convert
 * @param stops The list of stops used in these routes
 */
export const convertRoutesToDailyDataRoutes = (
  routes: Route[],
  stops: Stop[]
): DailyDataRoute[] => {
  return routes.map((route) => {
    const stopList: DailyDataRouteStop[] = route.stopList.map(
      (originalStop) => {
        const hydratedStop = stops.find(
          (val) => val.id === originalStop.stopId
        );
        if (!hydratedStop)
          throw new ValidationException(
            `Please provide stop with id: ${originalStop.stopId}`
          );

        return {
          ...originalStop,
          id: originalStop.stopId,
          point: hydratedStop.point,
        };
      }
    );
    return {
      ...route,
      stopList,
    };
  });
};
