import { ISODateString, ISOTimeString, TransitEntity } from '../interfaces';
import { Route } from '../routes/interfaces';
import { Stop } from '../stops/interfaces';
import { Trip, TripDirection } from '../trips/interfaces';

/**
 * The timetable and trip data for a particular date. By saving these details,
 * it means we can just generate this once and run the expensive queries once.
 *
 * All other calls will just be pulling the data out of the database.
 */
export interface DailyTransitData extends TransitEntity {
  /** The date this data is for */
  date: ISODateString;
  /** List of routes used on that day */
  routes: Route[];
  /** List of trips used on that day */
  trips: Trip[];
  /** List of stops used on that day */
  stops: Stop[];
  /**
   * A list of times that each trip starts on this date. This should be unique
   * to each trip_id and time. Generated from each trip's frequencies array.
   */
  trip_start_times: { trip_id: string; time: ISOTimeString }[];
  /**
   * A list of times a bus arrives at a particular stop. This is a timetable
   * that is generated so the frontend can display a particular stop's
   * timetable to see when the next bus will arrive, etc.
   */
  stop_timetables: {
    stop_id: string;
    times: {
      /** The route it is for */
      route_id: string;
      /** The direction of that route */
      direction: TripDirection;
      /** The arrival time of the bus */
      arrival_time: ISOTimeString;
      /** The departure time of the bus */
      departure_time: ISOTimeString;
    }[];
  }[];
}
