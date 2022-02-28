import { BaseEntity } from 'core/interfaces';

export enum TripDirection {
  Outbound = 0,
  Inbound = 1,
}

export enum TripWheelchairAccessible {
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

export enum TripBikesAllowed {
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

export type Trip = BaseEntity & {
  /**
   * The trip_id provided when data is imported, if it was imported at all.
   */
  imported_id: string | null;
  /** Identifies a route. */
  route_id: string;
  /**
   * Identifies a set of dates when service is available for one or more routes.
   */
  service_id: string;
  /**
   * Text that appears on signage identifying the trip's destination to riders.
   * Use this field to distinguish between different patterns of service on the
   * same route. If the headsign changes during a trip, `trip_headsign` can be
   * overridden by specifying values for the `stop_times.stop_headsign`.
   */
  trip_headsign: string | null;
  /**
   * Public facing text used to identify the trip to riders, for instance, to
   * identify train numbers for commuter rail trips. If riders do not commonly
   * rely on trip names, leave this field empty. A `trip_short_name` value, if
   * provided, should uniquely identify a trip within a service day; it should
   * not be used for destination names or limited/express designations.
   */
  trip_short_name: string | null;
  /**
   * Indicates the direction of travel for a trip. This field is not used in
   * routing; it provides a way to separate trips by direction when publishing
   * time tables.
   *
   * Example: The `trip_headsign` and `direction_id` fields could be used
   * together to assign a name to travel in each direction for a set of trips.
   * A trips.txt file could contain these records for use in time tables:
   * `trip_id,...,trip_headsign,direction_id`
   * `1234,...,Airport,0`
   * `1505,...,Downtown,1`
   */
  direction_id: TripDirection | null;
  /**
   * Identifies the block to which the trip belongs. A block consists of a
   * single trip or many sequential trips made using the same vehicle, defined
   * by shared service days and `block_id`. A `block_id` can have trips with
   * different service days, making distinct blocks.
   */
  block_id: string | null;
  /**
   * Identifies a geospatial shape describing the vehicle travel path for a
   * trip.
   *
   * Conditionally Required:
   * - Required if the trip has a continuous pickup or drop-off behavior
   *   defined either in `routes.txt` or in `stop_times.txt`.
   * - Optional otherwise.
   */
  shape_id: string | null;
  /** 	Indicates wheelchair accessibility. */
  wheelchair_accessible: TripWheelchairAccessible | null;
  /** Indicates whether bikes are allowed. */
  bikes_allowed: TripBikesAllowed | null;
};
