import { Store } from 'redux';

export * from './reducer';

export class Shuttles {
  constructor(private store: Store) {

  }

  getDailyData(params: { townId: string, timestamp: number }) {
    const state = this.store.getState();
    
    // Check in the store if data exists
    const data = getDailyDataSelector(townId, timestamp);
    // if it does then return it
    if (data) return data;
    
    // If not, then dispatch a getdailydata action
    this.store.dispatch({
      type: 'SHUTTLES/GET_DAILY_DATA',
      payload: {

      },
      // meta: {
      //   offline: ...
      // }
    })
  }
}