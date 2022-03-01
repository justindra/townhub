import {
  BaseEntity,
  NonNegativeInteger,
  Nullable,
  URL,
} from '../../core/interfaces';

/** Color in Hex code, e.g. FFFFFF or 000000 */
type Color = string;

export enum RouteType {
  /**
   * Tram, Streetcar, Light rail. Any light rail or street level system within
   * a metropolitan area.
   */
  Tram = 0,
  /**
   * Subway, Metro. Any underground rail system within a metropolitan area.
   */
  Subway = 1,
  /**
   * Rail. Used for intercity or long-distance travel.
   */
  Rail = 2,
  /**
   * Bus. Used for short- and long-distance bus routes.
   */
  Bus = 3,
  /**
   * Ferry. Used for short- and long-distance boat service.
   */
  Ferry = 4,
  /**
   * Cable tram. Used for street-level rail cars where the cable runs beneath
   * the vehicle, e.g., cable car in San Francisco.
   */
  CableTram = 5,
  /**
   * Aerial lift, suspended cable car (e.g., gondola lift, aerial tramway).
   * Cable transport where cabins, cars, gondolas or open chairs are suspended
   * by means of one or more cables.
   */
  AerialLift = 6,
  /**
   * Funicular. Any rail system designed for steep inclines.
   */
  Funicular = 7,
  /**
   * Trolleybus. Electric buses that draw power from overhead wires using poles.
   */
  Trolleybus = 11,
  /**
   * Monorail. Railway in which the track consists of a single rail or a beam.
   */
  Monorail = 12,
}

export enum ContinuousBehaviour {
  /** Continuous stopping pickup/drop-off. */
  Continuous = 0,
  /** No continuous stopping pickup/drop-off. */
  None = 1,
  /** Must phone agency to arrange continuous stopping pickup/drop-off. */
  PhoneAgency = 2,
  /** Must coordinate with driver to arrange continuous stopping pickup/drop-off. */
  Coordinate = 3,
}

export const ROUTE_ENTITY_TYPE = 'transit-route';

/**
 * Transit routes. A route is a group of trips that are displayed to riders as
 * a single service.
 */
export type Route = BaseEntity & {
  /**
   * The service_id provided when data is imported, if it was imported at all.
   * @added This field is added ontop of the standard GTFS spec
   */
  imported_id: Nullable<string>;
  /**
   * Agency for the specified route.
   */
  agency_id: string;
  /**
   * Short name of a route. This will often be a short, abstract identifier
   * like "32", "100X", or "Green" that riders use to identify a route, but
   * which doesn't give any indication of what places the route serves. Either
   * `route_short_name` or `route_long_name` must be specified, or potentially
   * both if appropriate.
   */
  route_short_name: string;
  /**
   * Full name of a route. This name is generally more descriptive than the
   * route_short_name and often includes the route's destination or stop.
   * Either route_short_name or route_long_name must be specified, or
   * potentially both if appropriate.
   */
  route_long_name: string;
  /**
   * Description of a route that provides useful, quality information. Do not
   * simply duplicate the name of the route.
   *
   * Example: "A" trains operate between Inwood-207 St, Manhattan and Far
   * Rockaway-Mott Avenue, Queens at all times. Also from about 6AM until about
   * midnight, additional "A" trains operate between Inwood-207 St and Lefferts
   * Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway).
   */
  route_desc: string | null;
  /** Indicates the type of transportation used on a route. */
  route_type: RouteType;
  /**
   * URL of a web page about the particular route. Should be different from the
   * agency.agency_url value.
   */
  route_url: URL | null;
  /**
   * Route color designation that matches public facing material. Defaults to
   * white (FFFFFF) when omitted or left empty. The color difference between
   * route_color and route_text_color should provide sufficient contrast when
   * viewed on a black and white screen.
   */
  route_color: Color | null;
  /**
   * Legible color to use for text drawn against a background of route_color.
   * Defaults to black (000000) when omitted or left empty. The color
   * difference between route_color and route_text_color should provide
   * sufficient contrast when viewed on a black and white screen.
   */
  route_text_color: Color | null;
  /**
   * Orders the routes in a way which is ideal for presentation to customers.
   * Routes with smaller route_sort_order values should be displayed first.
   */
  route_sort_order: NonNegativeInteger | null;
  /**
   * Indicates that the rider can board the transit vehicle at any point along
   * the vehicle’s travel path as described by shapes.txt, on every trip of the
   * route.
   */
  continuous_pickup: ContinuousBehaviour | null;
  /**
   * Indicates that the rider can alight from the transit vehicle at any point
   * along the vehicle’s travel path as described by shapes.txt, on every trip
   * of the route.
   */
  continuous_drop_off: ContinuousBehaviour | null;
};
