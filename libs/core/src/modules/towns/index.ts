import { TownsDatabase } from './database';

export * from './database';
export * from './interfaces';

/**
 * Get a town based on it's HID
 * @param townHid The town's HID
 */
export const getByHid = async (
  townHid: string,
) => {
  const Towns = new TownsDatabase();

  return Towns.getByHid(townHid);
}