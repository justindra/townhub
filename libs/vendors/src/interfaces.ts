import { BaseEntity } from '@townhub-libs/core';

export const LINK_TYPES = {
  website: 'website' as const,
  facebook: 'facebook' as const,
  instagram: 'instagram' as const,
}

export type VendorLinkType = typeof LINK_TYPES.website | typeof LINK_TYPES.facebook | typeof LINK_TYPES.instagram

export interface VendorLink {
  name: string;
  url: string;
  type: VendorLinkType;
}

export interface Vendor extends BaseEntity {
  /** The id of the town this vendor belongs to */
  townId: string;
  /** Name of the vendor */
  name: string;
  /** A description of the vendor */
  description: string;
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
}
