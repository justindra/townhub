import { BaseEntity } from '@townhub-libs/core';

export const LINK_TYPES = {
  WEBSITE: 'website' as const,
  FACEBOOK: 'facebook' as const,
  INSTAGRAM: 'instagram' as const,
};

export type VendorLinkType =
  | typeof LINK_TYPES.WEBSITE
  | typeof LINK_TYPES.FACEBOOK
  | typeof LINK_TYPES.INSTAGRAM;

export interface VendorLink {
  name: string;
  url: string;
  type: VendorLinkType;
}

export const VENDOR_CATEGORIES = {
  ARTISAN: {
    name: 'artisan' as const,
    label: 'Artisans',
    description:
      'Local artists, makers and designers creating one-of-a-kind pieces.',
    icon: ['far', 'hammer-war'],
  },
  STORE: {
    name: 'store' as const,
    label: 'Stores',
    description:
      'Local stores with a physical location where people can come in.',
    icon: ['fas', 'store-alt'],
  },
  FOOD_DRINKS: {
    name: 'food_drinks' as const,
    label: 'Food and drinks',
    description:
      'Local restaurants, cafes and bars to feed your hunger and quench your thirst.',
    icons: ['fas', 'utensils-alt'],
  },
};

export type VendorCategory =
  | typeof VENDOR_CATEGORIES.ARTISAN.name
  | typeof VENDOR_CATEGORIES.FOOD_DRINKS.name
  | typeof VENDOR_CATEGORIES.STORE.name;

export interface VendorOpeningHours {
  /**
   * The day of the week this opening hours is in use, starting with Monday as 1
   * and ending with Sunday as 7
   * e.g. for Monday, Wednesday and Friday - [1, 3, 5]
   *
   * These numbers are based on Luxon's specs
   * https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-get-weekday
   * */
  dayOfWeek: number;
  startHours: number;
  startMinutes: number;
  endHours: number;
  endMinutes: number;
}

export interface Vendor extends BaseEntity {
  /** The id of the town this vendor belongs to */
  townId: string;
  /** Name of the vendor */
  name: string;
  /** A description of the vendor */
  description: string;
  /** The categories the vendor falls under */
  categories: VendorCategory[];
  /** The logo for the vendor */
  logo?: string;
  /** Links to other web resources we can link to */
  links: VendorLink[];
  /** Images to show case */
  images: string[];
  /** The email address to contact them on */
  email: string;
  /** A phone number to contact them on */
  phone: string;
  /** A vendor's physical address */
  address: string;
  /** A list of their opening hours */
  openingHours: VendorOpeningHours[];
}
