import { VendorsDatabase } from "./database"

/**
 * List all the vendors in the town
 * @param townId The town to list
 */
export const list = async (townId: string) => {
  const VendorsClient = new VendorsDatabase();
  return VendorsClient.listByTown(townId);
}