import { DailyData } from '@townhub-libs/core';
import { Reducer } from 'redux';
import { BaseAction } from '../../base';

export interface ShuttleStoreState {
  dailyDataByDate: {
    [date: string]: DailyData;
  };
}

const INITIAL_STATE: ShuttleStoreState = {
  dailyDataByDate: {
    '2020-11-08': {
      id: '1',
      townId: 'townXYZ',
      timestamp: '2020-11-08',
      schedules: [],
      stops: [],
      routes: [],
      createdAt: 1,
      updatedAt: 1
    }
  },
};

export const ShuttleReducer: Reducer<ShuttleStoreState, BaseAction> = (
  state = INITIAL_STATE
) => {
  return state;
};
