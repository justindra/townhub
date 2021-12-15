import {
  ISOTimeString,
  NonNegativeInteger,
  TransitEntity,
} from '../interfaces';

export enum TripDirection {
  Outbound = 0,
  Inbound = 1,
}

enum TripWheelchairAccessible {
  /**
   * No accessibility information for the trip.
   */
  NoInformation = 0,
  /**
   * Vehicle being used on this particular trip can accommodate at least one rider in a wheelchair.
   */
  Available = 1,
  /**
   * No riders in wheelchairs can be accommodated on this trip.
   */
  NotAccesible = 2,
}

enum TripBikesAllowed {
  /**
   * No bike information for the trip.
   */
  NoInformation = 0,
  /**
   * Vehicle being used on this particular trip can accommodate at least one bicycle.
   */
  Allowed = 1,
  /**
   * No bicycles are allowed on this trip.
   */
  NotAllowed = 2,
}

interface TripStop {
  /**
   * Identifies the serviced stop. All stops serviced during a trip must have
   * a record in stop_times.txt. Referenced locations must be stops, not
   * stations or station entrances. A stop may be serviced multiple times in
   * the same trip, and multiple trips and routes may service the same stop.
   */
  stop_id: string;
  /**
   * Arrival time at a specific stop for a specific trip on a route. If there
   * are not separate times for arrival and departure at a stop, enter the
   * same value for arrival_time and departure_time. For times occurring after
   * midnight on the service day, enter the time as a value greater than
   * 24:00:00 in HH:MM:SS local time for the day on which the trip schedule
   * begins.
   *
   * Scheduled stops where the vehicle strictly adheres to the specified arrival
   * and departure times are timepoints. If this stop is not a timepoint, it
   * is recommended to provide an estimated or interpolated time. If this is
   * not available, arrival_time can be left empty. Further, indicate that
   * interpolated times are provided with timepoint=0. If interpolated times
   * are indicated with timepoint=0, then time points must be indicated with
   * timepoint=1. Provide arrival times for all stops that are time points.
   * An arrival time must be specified for the first and the last stop in a
   * trip.
   */
  arrival_time: ISOTimeString;
  /**
   * Departure time from a specific stop for a specific trip on a route. For
   * times occurring after midnight on the service day, enter the time as a
   * value greater than 24:00:00 in HH:MM:SS local time for the day on which
   * the trip schedule begins. If there are not separate times for arrival
   * and departure at a stop, enter the same value for arrival_time and
   * departure_time. See the arrival_time description for more details about
   * using timepoints correctly.
   *
   * The departure_time field should specify time values whenever possible,
   * including non-binding estimated or interpolated times between timepoints.
   */
  departure_time: ISOTimeString;
}

enum TripFrequencyType {
  /**
   * Frequency-based service (exact_times=0) in which service does not follow a
   * fixed schedule throughout the day. Instead, operators attempt to strictly
   * maintain predetermined headways for trips.
   */
  Frequency = 0,
  /**
   * Schedule-based trips with the exact same headway throughout the day. In
   * this case the end_time value must be greater than the last desired trip
   * start_time but less than the last desired trip start_time + headway_secs.
   *
   * A compressed representation of schedule-based service (exact_times=1) that
   * has the exact same headway for trips over specified time period(s). In
   * schedule-based service operators try to strictly adhere to a schedule.
   */
  Schedule = 1,
}

interface TripFrequency {
  /**
   * Time at which the first vehicle departs from the first stop of the trip
   * with the specified headway.
   */
  start_time: ISOTimeString;
  /**
   * Time at which service changes to a different headway (or ceases) at the
   * first stop in the trip.
   */
  end_time: ISOTimeString;
  /**
   * Time, in seconds, between departures from the same stop (headway) for the
   * trip, during the time interval specified by start_time and end_time.
   * Multiple headways for the same trip are allowed, but may not overlap. New
   * headways may start at the exact time the previous headway ends.
   */
  headway_secs: NonNegativeInteger;
  exact_times: TripFrequencyType;
}

export interface Trip extends TransitEntity {
  /** Identifies a route. */
  route_id: string;
  /**
   * Identifies a set of dates when service is available for one or more routes
   */
  service_ids: string[];
  /**
   * An ordered list of stops that is included in this trip, the index in the
   * array, indicates the sequence.
   */
  stops: TripStop[];
  /**
   * The frequencies that the trip occurs throughout the day
   */
  frequencies: TripFrequency[];
  /**
   * Text that appears on signage identifying the trip's destination to riders.
   * Use this field to distinguish between different patterns of service on the
   * same route. If the headsign changes during a trip, trip_headsign can be
   * overridden by specifying values for the stop_times.stop_headsign.
   */
  trip_headsign?: string;
  /**
   * Public facing text used to identify the trip to riders, for instance, to
   * identify train numbers for commuter rail trips. If riders do not commonly
   * rely on trip names, leave this field empty. A trip_short_name value, if
   * provided, should uniquely identify a trip within a service day; it should
   * not be used for destination names or limited/express designations.
   */
  trip_short_name?: string;
  /**
   * Indicates the direction of travel for a trip. This field is not used in
   * routing; it provides a way to separate trips by direction when publishing
   * time tables.
   *
   * Example: The trip_headsign and direction_id fields could be used together
   * to assign a name to travel in each direction for a set of trips. A
   * trips.txt file could contain these records for use in time tables:
   * * trip_id,...,trip_headsign,direction_id
   * * 1234,...,Airport,0
   * * 1505,...,Downtown,1
   */
  direction_id?: TripDirection;
  /** Indicates wheelchair accessibility. */
  wheelchair_accessible?: TripWheelchairAccessible;
  /** Indicates whether bikes are allowed */
  bikes_allowed?: TripBikesAllowed;
}
