import { BaseEntity, Date } from 'core/interfaces';

enum ServiceAvailability {
  /**
   * Service is available for all days in the date range.
   */
  Available = 1,
  /**
   * Service is not available for days in the date range.
   */
  NotAvailable = 0,
}

export type Calendar = BaseEntity & {
  /**
   * The service_id provided when data is imported, if it was imported at all.
   */
  imported_id: string | null;
  /**
   * Indicates whether the service operates on all Mondays in the date range
   * specified by the `start_date` and `end_date` fields. Note that exceptions
   * for particular dates may be listed in `calendar_dates.txt`.
   */
  monday: ServiceAvailability;
  /**
   * Functions in the same way as monday except applies to Tuesdays
   */
  tuesday: ServiceAvailability;
  /**
   * 	Functions in the same way as monday except applies to Wednesdays
   */
  wednesday: ServiceAvailability;
  /**
   * 	Functions in the same way as monday except applies to Thursdays
   */
  thursday: ServiceAvailability;
  /**
   * 	Functions in the same way as monday except applies to Fridays
   */
  friday: ServiceAvailability;
  /**
   * 	Functions in the same way as monday except applies to Saturdays.
   */
  saturday: ServiceAvailability;
  /**
   * 	Functions in the same way as monday except applies to Sundays.
   */
  sunday: ServiceAvailability;
  /**
   * Start service day for the service interval.
   */
  start_date: Date;
  /**
   * End service day for the service interval. This service day is included in
   * the interval.
   */
  end_date: Date;
};
