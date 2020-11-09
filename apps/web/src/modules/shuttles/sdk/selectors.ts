import { DailyData } from '@townhub-libs/core';
import { ShuttleStoreState } from './reducer';

export const getDailyData = (
  state: ShuttleStoreState,
  timestamp: string
): DailyData => {
  return state.dailyDataByDate[timestamp];
};
