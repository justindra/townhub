import { BaseEntity, Timezone } from '../../core';

type Latitude = number;
type Longitude = number;

enum StopLocationType {
  /**
   * A location where passengers board or disembark from a transit vehicle. Is
   * called a platform when defined within a parent_station.
   */
  Stop = 0,
  /**
   * A physical structure or area that contains one or more platform.
   */
  Station = 1,
  /**
   * A location where passengers can enter or exit a station from the street.
   * If an entrance/exit belongs to multiple stations, it can be linked by
   * pathways to both, but the data provider must pick one of them as parent.
   */
  EntranceExit = 2,
  /**
   * A location within a station, not matching any other location_type, which
   * can be used to link together pathways define in pathways.txt.
   */
  GenericNode = 3,
  /**
   * A specific location on a platform, where passengers can board and/or
   * alight vehicles.
   */
  BoardingArea = 4,
}

/**
 * Indicates whether wheelchair boardings are possible from the location. Valid
 * options are:
 *
 * For parentless stops:
 * * 0 or empty - No accessibility information for the stop.
 * * 1 - Some vehicles at this stop can be boarded by a rider in a wheelchair.
 * * 2 - Wheelchair boarding is not possible at this stop.
 *
 * For child stops:
 * * 0 or empty - Stop will inherit its wheelchair_boarding behavior from the
 *   parent station, if specified in the parent.
 * * 1 - There exists some accessible path from outside the station to the
 *   specific stop/platform.
 * * 2 - There exists no accessible path from outside the station to the
 *   specific stop/platform.
 *
 * For station entrances/exits:
 * * 0 or empty - Station entrance will inherit its wheelchair_boarding
 *   behavior from the parent station, if specified for the parent.
 * * 1 - Station entrance is wheelchair accessible.
 * * 2 - No accessible path from station entrance to stops/platforms.
 */
enum StopWheelchairBoarding {
  Inherit = 0,
  Some = 1,
  None = 2,
}

export const STOP_ENTITY_TYPE = 'transit-stop';

/**
 * Identifies a stop, station, or station entrance.
 *
 * The term "station entrance" refers to both station entrances and station
 * exits. Stops, stations or station entrances are collectively referred to as
 * locations. Multiple routes may use the same stop.
 */
export type Stop = BaseEntity & {
  /**
   * The id provided when data is imported, if it was imported at all.
   */
  imported_id: string | null;
  /**
   * Short text or a number that identifies the location for riders. These
   * codes are often used in phone-based transit information systems or printed
   * on signage to make it easier for riders to get information for a
   * particular location. The code can be the same as id if it is
   * public facing. This field should be left empty for locations without a
   * code presented to riders.
   */
  code: string | null;
  /**
   * Name of the location. Use a name that people will understand in the local
   * and tourist vernacular.
   *
   * When the location is a boarding area (location_type=4), the name
   * should contains the name of the boarding area as displayed by the agency.
   * It could be just one letter (like on some European intercity railway
   * stations), or text like “Wheelchair boarding area” (NYC’s Subway) or “Head
   * of short trains” (Paris’ RER).
   *
   * Conditionally Required:
   *  * Required for locations which are stops (location_type=0), stations
   *    (location_type=1) or entrances/exits (location_type=2).
   *  * Optional for locations which are generic nodes (location_type=3) or
   *    boarding areas (location_type=4).
   */
  name: string;
  /**
   * Readable version of the name. See "Text-to-speech field" in the Term
   * Definitions for more.
   */
  tts_name: string | null;
  /**
   * Description of the location that provides useful, quality information. Do
   * not simply duplicate the name of the location.
   */
  description: string | null;
  /**
   * 	Latitude of the location.
   *
   * For stops/platforms (location_type=0) and boarding area (location_type=4),
   * the coordinates must be the ones of the bus pole — if exists — and
   * otherwise of where the travelers are boarding the vehicle (on the sidewalk
   * or the platform, and not on the roadway or the track where the vehicle stops).
   *
   * Conditionally Required:
   * * Required for locations which are stops (location_type=0), stations
   *   (location_type=1) or entrances/exits (location_type=2).
   * * Optional for locations which are generic nodes (location_type=3) or
   *   boarding areas (location_type=4).
   */
  lat: Latitude | null;
  /**
   * 	Longitude of the location.
   *
   * For stops/platforms (location_type=0) and boarding area (location_type=4),
   * the coordinates must be the ones of the bus pole — if exists — and
   * otherwise of where the travelers are boarding the vehicle (on the sidewalk
   * or the platform, and not on the roadway or the track where the vehicle stops).
   *
   * Conditionally Required:
   * * Required for locations which are stops (location_type=0), stations
   *   (location_type=1) or entrances/exits (location_type=2).
   * * Optional for locations which are generic nodes (location_type=3) or
   *   boarding areas (location_type=4).
   */
  lon: Longitude | null;
  /**
   * Identifies the fare zone for a stop. This field is required if providing
   * fare information using fare_rules.txt, otherwise it is optional. If this
   * record represents a station or station entrance, the zone_id is ignored.
   */
  zone_id: string | null;
  /**
   * URL of a web page about the location. This should be different from the
   * agency.agency_url and the routes.route_url field values.
   */
  url: string | null;
  /** Type of the location */
  location_type: StopLocationType | null;
  /**
   * Defines hierarchy between the different locations defined in stops.txt. It
   * contains the ID of the parent location, as followed:
   * * Stop/platform (location_type=0): the parent_station field contains the
   *   ID of a station.
   * * Station (location_type=1): this field must be empty.
   * * Entrance/exit (location_type=2) or generic node (location_type=3): the
   *   parent_station field contains the ID of a station (location_type=1)
   * * Boarding Area (location_type=4): the parent_station field contains ID of
   *   a platform.
   *
   * Conditionally Required:
   * * Required for locations which are entrances (location_type=2), generic
   *   nodes (location_type=3) or boarding areas (location_type=4).
   * * Optional for stops/platforms (location_type=0).
   * * Forbidden for stations (location_type=1).
   */
  parent_station: string | null;
  /**
   * Timezone of the location. If the location has a parent station, it
   * inherits the parent station’s timezone instead of applying its own.
   * Stations and parentless stops with empty timezone inherit the
   * timezone specified by agency.agency_timezone. If timezone values are
   * provided, the times in times.txt should be entered as the time since
   * midnight in the timezone specified by agency.agency_timezone. This ensures
   * that the time values in a trip always increase over the course of a trip,
   * regardless of which timezones the trip crosses.
   */
  timezone: Timezone | null;
  /**
   * Indicates whether wheelchair boardings are possible from the location.
   */
  wheelchair_boarding: StopWheelchairBoarding | null;
  /**
   * Level of the location. The same level can be used by multiple unlinked
   * stations.
   */
  level_id: string | null;
  /**
   * Platform identifier for a platform stop (a stop belonging to a station).
   * This should be just the platform identifier (eg. "G" or "3"). Words like
   * “platform” or "track" (or the feed’s language-specific equivalent) should
   * not be included. This allows feed consumers to more easily
   * internationalize and localize the platform identifier into other languages.
   */
  platform_code: string | null;
};
