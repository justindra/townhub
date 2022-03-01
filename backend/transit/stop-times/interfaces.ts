import { BaseEntity, NonNegativeInteger } from '../../core/interfaces';

enum PickupType {
  /** Regularly scheduled pickup. (default when empty) */
  Regular = 0,
  /** No pickup available. */
  NoPickup = 1,
  /** Must phone agency to arrange pickup. */
  PhonePickup = 2,
  /** Must coordinate with driver to arrange pickup. */
  DriverPickup = 3,
}

enum DropOffType {
  /** Regularly scheduled drop off. (default when empty) */
  Regular = 0,
  /** No drop off available. */
  NoDropOff = 1,
  /** Must phone agency to arrange drop off. */
  PhoneDropOff = 2,
  /** Must coordinate with driver to arrange drop off. */
  DriverDropOff = 3,
}

enum ContinuousPickupType {
  /** Continuous stopping pickup. */
  Continuous = 0,
  /** No continuous stopping pickup (when empty). */
  NoContinuous = 1,
  /** Must phone agency to arrange continuous stopping pickup. */
  PhoneContinuous = 2,
  /** Must coordinate with driver to arrange continuous stopping pickup. */
  DriverContinuous = 3,
}

enum ContinuousDropOffType {
  /** Continuous stopping drop off. */
  Continuous = 0,
  /** No continuous stopping drop off (when empty). */
  NoContinuous = 1,
  /** Must phone agency to arrange continuous stopping drop off. */
  PhoneContinuous = 2,
  /** Must coordinate with driver to arrange continuous stopping drop off. */
  DriverContinuous = 3,
}
enum TimePoint {
  /** Times are considered approximate. */
  Approximate = 0,
  /** Times are considered exact. (default when empty) */
  Exact = 1,
}

export type StopTime = BaseEntity & {
  /** Identifies a trip. */
  trip_id: string;
  /**
   * Arrival time at a specific stop for a specific trip on a route. If there
   * are not separate times for arrival and departure at a stop, enter the same
   * value for `arrival_time` and `departure_time`. For times occurring after
   * midnight on the service day, enter the time as a value greater than
   * 24:00:00 in HH:MM:SS local time for the day on which the trip schedule
   * begins.
   *
   * Scheduled stops where the vehicle strictly adheres to the specified
   * arrival and departure times are timepoints. If this stop is not a
   * timepoint, it is recommended to provide an estimated or interpolated time.
   * If this is not available, arrival_time can be left empty. Further,
   * indicate that interpolated times are provided with timepoint=0. If
   * interpolated times are indicated with timepoint=0, then time points must
   * be indicated with timepoint=1. Provide arrival times for all stops that
   * are time points. An arrival time must be specified for the first and the
   * last stop in a trip.
   */
  arrival_time: string | null;
  /**
   * Departure time from a specific stop for a specific trip on a route. For
   * times occurring after midnight on the service day, enter the time as a
   * value greater than 24:00:00 in HH:MM:SS local time for the day on which
   * the trip schedule begins. If there are not separate times for arrival and
   * departure at a stop, enter the same value for `arrival_time` and
   * `departure_time`. See the arrival_time description for more details about
   * using timepoints correctly.
   *
   * The `departure_time` field should specify time values whenever possible,
   * including non-binding estimated or interpolated times between timepoints.
   */
  departure_time: string | null;
  /**
   * Identifies the serviced stop. All stops serviced during a trip must have a
   * record in stop_times.txt. Referenced locations must be stops, not stations
   * or station entrances. A stop may be serviced multiple times in the same
   * trip, and multiple trips and routes may service the same stop.
   */
  stop_id: string;
  /**
   * Order of stops for a particular trip. The values must increase along the
   * trip but do not need to be consecutive.
   *
   * Example: The first location on the trip could have a `stop_sequence=1`,
   * the second location on the trip could have a `stop_sequence=23`, the third
   * location could have a `stop_sequence=40`, and so on.
   */
  stop_sequence: NonNegativeInteger;
  /**
   * 	Text that appears on signage identifying the trip's destination to riders.
   * This field overrides the default `trips.trip_headsign` when the headsign
   * changes between stops. If the headsign is displayed for an entire trip,
   * use `trips.trip_headsign` instead.
   *
   * A `stop_headsign` value specified for one `stop_time` does not apply to
   * subsequent `stop_times` in the same trip. If you want to override the
   * `trip_headsign` for multiple `stop_times` in the same trip, the
   * `stop_headsign` value must be repeated in each `stop_time` row.
   */
  stop_headsign: string | null;
  /**
   * 	Indicates pickup method.
   */
  pickup_type: PickupType | null;
  /**
   * Indicates drop off method.
   */
  drop_off_type: DropOffType | null;
  /**
   * 	Indicates that the rider can board the transit vehicle at any point along
   * the vehicle’s travel path as described by `shapes.txt`, from this
   * `stop_time` to the next `stop_time` in the trip’s `stop_sequence`.
   *
   * If this field is populated, it overrides any continuous pickup behavior
   * defined in `routes.txt`. If this field is empty, the `stop_time` inherits
   * any continuous pickup behavior defined in `routes.txt`.
   */
  continuous_pickup: ContinuousPickupType | null;
  /**
   * Indicates that the rider can alight from the transit vehicle at any point
   * along the vehicle’s travel path as described by `shapes.txt`, from this
   * `stop_time` to the next `stop_time` in the trip’s `stop_sequence`.
   *
   * If this field is populated, it overrides any continuous drop-off behavior
   * defined in `routes.txt`. If this field is empty, the `stop_time` inherits
   * any continuous drop-off behavior defined in `routes.txt`.
   */
  continuous_drop_off: ContinuousDropOffType | null;
  /**
   * Actual distance traveled along the associated shape, from the first stop
   * to the stop specified in this record. This field specifies how much of the
   * shape to draw between any two stops during a trip. Must be in the same
   * units used in `shapes.txt`. Values used for `shape_dist_traveled` must
   * increase along with `stop_sequence`; they cannot be used to show reverse
   * travel along a route.
   *
   * Example: If a bus travels a distance of 5.25 kilometers from the start of
   * the shape to the stop, `shape_dist_traveled=5.25`.
   */
  shape_dist_traveled: number | null;
  /**
   * 	Indicates if arrival and departure times for a stop are strictly adhered
   * to by the vehicle or if they are instead approximate and/or interpolated
   * times. This field allows a GTFS producer to provide interpolated
   * stop-times, while indicating that the times are approximate.
   */
  timepoint: TimePoint | null;
};
