import { BaseEntity, LanguageCode, Nullable, Timezone } from '@townhub/core';

/**
 * Transit agencies with service represented in this dataset.
 */
export type Agency = BaseEntity & {
  /**
   * The id provided when data is imported, if it was imported at all.
   * Identifies a transit brand which is often synonymous with a transit agency.
   * Note that in some cases, such as when a single agency operates multiple
   * separate services, agencies and brands are distinct. This document uses the
   * term "agency" in place of "brand". A dataset may contain data from multiple
   * agencies. This field is required when the dataset contains data for
   * multiple transit agencies, otherwise it is optional.
   */
  imported_id: Nullable<string>;
  /** Full name of the transit agency. */
  name: string;
  /** URL of the transit agency. */
  url: string;
  /**
   * Timezone where the transit agency is located. If multiple agencies are
   * specified in the dataset, each must have the same timezone.
   */
  timezone: Timezone;
  /**
   * Primary language used by this transit agency. This field helps GTFS
   * consumers choose capitalization rules and other language-specific settings
   * for the dataset.
   */
  lang: Nullable<LanguageCode>;
  /**
   * A voice telephone number for the specified agency. This field is a string
   * value that presents the telephone number as typical for the agency's
   * service area. It can and should contain punctuation marks to group the
   * digits of the number. Dialable text (for example, TriMet's "503-238-RIDE")
   * is permitted, but the field must not contain any other descriptive text.
   */
  phone: Nullable<string>;
  /**
   * URL of a web page that allows a rider to purchase tickets or other fare
   * instruments for that agency online.
   */
  fare_url: Nullable<string>;
  /**
   * Email address actively monitored by the agency’s customer service
   * department. This email address should be a direct contact point where
   * transit riders can reach a customer service representative at the agency.
   */
  email: Nullable<string>;
};
