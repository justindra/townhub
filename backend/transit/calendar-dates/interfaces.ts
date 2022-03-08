import { BaseEntity, Date } from '../../core/interfaces';

export enum CalendarDateExceptionType {
  /** Service has been added for the specified date. */
  ServiceAdded = 1,
  /** Service has been removed for the specified date. */
  ServiceRemoved = 2,
}

export type CalendarDate = BaseEntity & {
  /**
   * Identifies a set of dates when a service exception occurs for one or more
   * routes. Each (`service_id`, `date`) pair can only appear once in
   * `calendar_dates.txt` if using `calendar.txt` and `calendar_dates.txt` in
   * conjunction. If a `service_id` value appears in both `calendar.txt` and
   * `calendar_dates.txt`, the information in `calendar_dates.txt` modifies the
   * service information specified in `calendar.txt`.
   */
  service_id: string;
  /** Date when service exception occurs. */
  date: Date;
  /**
   * Indicates whether service is available on the date specified in the date
   * field.
   *
   * Example: Suppose a route has one set of trips available on holidays and
   * another set of trips available on all other days. One `service_id` could
   * correspond to the regular service schedule and another `service_id` could
   * correspond to the holiday schedule. For a particular holiday, the
   * `calendar_dates.txt` file could be used to add the holiday to the holiday
   * `service_id` and to remove the holiday from the regular `service_id`
   * schedule.
   */
  exception_type: CalendarDateExceptionType;
};
