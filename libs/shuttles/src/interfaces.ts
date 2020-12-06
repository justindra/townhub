import { BaseEntity } from '@townhub-libs/core';

export interface RouteStop {
  stopId: string;
  /**
   * The number of minutes it takes to get here from the previous stop. It
   * should be 0 for the first stop.
   */
  legMinutes: number;
}

/** A calculated version of RouteStop for a particular date and startTime */
export interface RouteStopDepartureTime {
  stopId: string;
  /** The time of departure in minutes since midnight of the date */
  departureTimeMinutes: number;
}

/** A shuttle's route */
export interface Route extends BaseEntity {
  /** The town this belongs to */
  townId: string;
  name: string;
  description?: string;
  /** The list of stops in that route */
  stopList: RouteStop[];
}

export interface Point {
  lng: number;
  lat: number;
}

/** A shuttle stop location */
export interface Stop extends BaseEntity {
  /** The town this belongs to */
  townId: string;
  name: string;
  description?: string;
  /** The GPS Location of the stop */
  point: Point;
}

export interface StopScheduleRoute {
  // These are copied from the route details for the frontend to use
  id: string;
  name: string;
  description?: string;
  /**
   * The array is the times a shuttle is scheduled to stop here for a given
   * route in minutes from midnight.
   */
  schedule: number[];
}

/**
 * The stop details with the schedule it has for a particular day,
 * useful to return for info on a stop
 */
export interface StopSchedule extends Stop {
  /** The date the schedule is for (YYYY-MM-DD)*/
  scheduleDate: string;
  routes: StopScheduleRoute[];
}

export interface ScheduleStartTimes {
  /** The time the schedule starts in minutes since midnight */
  startTimeMinutes: number;
  /**
   * The day of the week this start time is in operation, starting with Monday as 1
   * and ending with Sunday as 7
   * e.g. for Monday, Wednesday and Friday - [1, 3, 5]
   *
   * These numbers are based on Luxon's specs
   * https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-get-weekday
   * */
  daysInOperation: number[];
  /**
   * List of any stops in the route to be hidden, basically means that the bus
   * will not stop at these particular stops for this particular start time.
   *
   * Allows us to use the same routes and adjust it simply by hiding stops.
   */
  hiddenStops: string[];
}

export interface Schedule extends BaseEntity {
  /** The town this belongs to */
  townId: string;
  /** The route to use */
  routeId: string;
  /** The day the route starts becoming active */
  startDate: number;
  /** The day the route starts becoming inactive, -1 means it never becomes inactive */
  endDate: number;
  /** The different time the route starts */
  startTimes: ScheduleStartTimes[];
}

export interface DailyDataRouteStop extends RouteStop {
  id: string;
  point: Point;
}

export interface DailyDataRoute extends Route {
  stopList: DailyDataRouteStop[];
}

/** The data for a particular data */
export interface DailyData extends BaseEntity {
  /** The date this data is related to (YYYY-MM-DD) */
  timestamp: string;
  /** The town this data relates to */
  townId: string;
  /** The list of stops used on that day */
  stops: StopSchedule[];
  /** The list of schedules used on that day */
  schedules: Schedule[];
  /** The list of routes used on that day */
  routes: DailyDataRoute[];
}
