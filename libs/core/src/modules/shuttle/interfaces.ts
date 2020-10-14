import { BaseEntity } from '../../base/database';

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
  /** The list of stops in that route */
  stopList: RouteStop[];
}

/** A shuttle stop location */
export interface Stop extends BaseEntity {
  /** The town this belongs to */
  townId: string;
  name: string;
  description?: string;
  /** The GPS Location of the stop */
  point?: {
    lng: number;
    lat: number;
  };
}

/**
 * The stop details with the schedule it has for a particular day,
 * useful to return for info on a stop
 */
export interface StopSchedule extends Stop {
  /** The date the schedule is for */
  scheduleDate: number;
  schedule: {
    /**
     * The key is a route's id and the array is the times a shuttle is scheduled
     * to stop here for a given route in minutes from midnight.
     */
    [routeId: string]: number[];
  };
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

/** The data for a particular data */
export interface DailyData extends BaseEntity {
  /** The date this data is related to, should be the 12pm on that date */
  timestamp: number;
  /** The town this data relates to */
  townId: string;
  /** The list of stops used on that day */
  stops: StopSchedule[];
  /** The list of schedules used on that day */
  schedules: Schedule[];
  /** The list of routes used on that day */
  routes: Route[];
}
