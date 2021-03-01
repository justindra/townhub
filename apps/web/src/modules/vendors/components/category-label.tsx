import { VendorCategory, VENDOR_CATEGORIES } from '@townhub-libs/vendors/web';
import React from 'react';

/**
 * Display the Category Label, based on the given category type
 */
export const CategoryLabel: React.FC<{ category: VendorCategory }> = ({
  category,
}) => {
  const categoryName = VENDOR_CATEGORIES[category.toUpperCase()].label;

  return <span>{categoryName}</span>;
};
