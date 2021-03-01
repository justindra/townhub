import { VendorCategory, VENDOR_CATEGORIES } from './interfaces';

/**
 * Check if a given category is valid or not
 * @param categoryToCheck The category name to check
 */
export const isValidCategory = (categoryToCheck: string): boolean => {
  const VALID_CATEGORIES = [
    VENDOR_CATEGORIES.ARTISAN.name,
    VENDOR_CATEGORIES.FOOD_DRINKS.name,
    VENDOR_CATEGORIES.STORE.name,
  ];

  return VALID_CATEGORIES.includes(categoryToCheck as VendorCategory);
};
