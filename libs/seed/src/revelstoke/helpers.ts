import { RouteStop } from '@townhub-libs/shuttles';
import { isEqual } from 'lodash';

export const hasSameStops = (
  stopListA: RouteStop[],
  stopListB: RouteStop[]
): boolean => {
  return isEqual(stopListA, stopListB);
};
