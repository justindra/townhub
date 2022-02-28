import { ColumnType, Generated } from 'kysely';
import { DateTime } from 'luxon';

/**
 * An IETF BCP 47 language code. For an introduction to IETF BCP 47, refer to
 * http://www.rfc-editor.org/rfc/bcp/bcp47.txt and http://www.w3.org/International/articles/language-tags/.
 * Example: `en` for English, `en-US` for American English or `de` for German.
 */
export type LanguageCode = string;
/**
 * TZ timezone from the https://www.iana.org/time-zones. Timezone names never
 * contain the space character but may contain an underscore. Refer to
 * http://en.wikipedia.org/wiki/List_of_tz_zones for a list of valid values.
 * Example: `Asia/Tokyo`, `America/Los_Angeles` or `Africa/Cairo`.
 */
export type Timezone = string;

/** Set field as nullable */
export type Nullable<TField> = TField | null;

/** A non-negative integer value */
export type NonNegativeInteger<T extends number = number> = number extends T
  ? never
  : `${T}` extends `-${string}` | `${string}.${string}`
  ? never
  : T;

export type URL = string;

export type BaseEntity = {
  /** The id of this entity, should be a v4 UUID */
  id: Generated<string>;
  /** The time this entity was created */
  created_at: ColumnType<DateTime, never, never>;
  /** The person who created the entity */
  created_by: ColumnType<string, string | undefined, never>;
  /** The time this entity was updated */
  updated_at: ColumnType<DateTime, string | undefined, string>;
  /** The person who updated the entity */
  updated_by: ColumnType<string, string | undefined, string>;
};

export type OmitAuditFields<TItem = BaseEntity> = Omit<
  TItem,
  'created_at' | 'updated_at' | 'created_by' | 'updated_by'
>;
export type OmitId<TItem> = Omit<TItem, 'id'>;

export type DatabaseCreateInput<TItem> = OmitAuditFields<OmitId<TItem>>;
export type DatabaseUpdateInput<TItem> = Partial<TItem>;
