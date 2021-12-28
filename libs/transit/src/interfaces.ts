import { BaseEntity } from '@townhub-libs/core';

export type URL = string;
export type LanguageCode = string;
export type PhoneNumber = string;
/** An IANA Timezone string */
export type Timezone = `${string}/${string}`;
/** An email type */
export type Email = `${string}@${string}.${string}`;
/** An ISO Date, formatted in YYYY-MM-DD */
export type ISODateString = string;
/** An ISO Time, formatted in HH:MM:SS */
export type ISOTimeString = string;

 /** A non-negative integer value */
export type NonNegativeInteger<T extends number = number> =
    number extends T 
        ? never 
        : `${T}` extends `-${string}` | `${string}.${string}`
            ? never 
            : T;

export interface TransitEntity<TEntiyType extends string> extends BaseEntity<TEntiyType> {
  /** The agency this entity belongs to */
  agency_id: string;
}