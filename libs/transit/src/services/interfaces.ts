import { ISODateString, TransitEntity } from '../interfaces';

export enum ServiceAvailability {
  NotAvailable = 0,
  Available = 1,
}

export enum ExceptionType {
  ServiceAdded = 1,
  ServiceRemoved = 2,
}

export interface Service extends TransitEntity {
  /** Indicates whether the service operates on this day of the week */
  monday: ServiceAvailability;
  /** Indicates whether the service operates on this day of the week */
  tuesday: ServiceAvailability;
  /** Indicates whether the service operates on this day of the week */
  wednesday: ServiceAvailability;
  /** Indicates whether the service operates on this day of the week */
  thursday: ServiceAvailability;
  /** Indicates whether the service operates on this day of the week */
  friday: ServiceAvailability;
  /** Indicates whether the service operates on this day of the week */
  saturday: ServiceAvailability;
  /** Indicates whether the service operates on this day of the week */
  sunday: ServiceAvailability;
  /** Start service day for the service interval. */
  start_date: ISODateString;
  /**
   * End service day for the service interval. This service day is included in
   * the interval.
   */
  end_date: ISODateString;
  /** List of exceptions to the service */
  exceptions: {
    /** Date when service exception occurs. */
    date: ISODateString;
    /** Indicates whether service is available on the date specified in the date field.  */
    exception_type: ExceptionType;
  }[];
}
