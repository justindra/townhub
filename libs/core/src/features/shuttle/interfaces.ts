import { BaseEntity } from '../../base/database';

export interface RouteStop {
  stopId: string;
  /**
   * The number of minutes it takes to get here from the previous stop. It
   * should be 0 for the first stop.
   */
  legMinutes: number;
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
   * The day of the week this start time is in operation, starting with Sunday as 0
   * e.g. for Monday, Wednesday and Friday - [1, 3, 5]
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
  /** The day the route starts becoming inactive */
  endDate?: number;
  /** The different time the route starts */
  startTimes: ScheduleStartTimes[];
}

/** The data for a particular data */
export interface DailyData {
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

export const getStopDetails = (): StopSchedule[] => {
  // Try and see if it already exists (cached in DB)
  // Get the stop
  // Find all routes scheduled today
  // For each schedule, check if this stop exists, if so then write down
  // and save that detail and return the full schedule for this stop
  return [];
};

// OR WE CAN DO THE BELOW AS A CRON JOB EVERY MORNING
// OR WE DO THE BELOW THE FIRST TIME SOMEONE ASKS FOR A SCHEDULE
// WHICH WILL TAKE LONGER FOR THAT FIRST REQUEST

export const generateStopSchedulesForToday = (): StopSchedule[] => {
  // Find all schedules for today
  // Go through each route and work out different times
  // for each stop that is being used today and then save that in the database
  // so that we can get the stop for today.
  return [];
};

// Will also need to get the list of stops for the day, or routes for the day with stops attached to those routes
