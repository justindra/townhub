import { Reducer } from "redux";
import { BaseAction, ShuttleReducer, ShuttleStoreState } from "../modules";

export interface TownModulesStoreState {
  [townId: string]: {
    shuttles: ShuttleStoreState;
  };
}

const INITIAL_STATE: TownModulesStoreState = {
  'townXYZ': {
    shuttles: ShuttleReducer(undefined, { type: '', townId: 'townXYZ', payload: {}})
  }
}

export const townModulesReducer: Reducer<TownModulesStoreState, BaseAction> = (
  state = INITIAL_STATE,
  action
) => {
  // If it doesn't have a townId then just return the state
  const townId = action.townId;
  if (!townId) return state;

  // Otherwise update the state for that particular town
  return {
    ...state,
    [townId]: {
      shuttles: ShuttleReducer(state[townId].shuttles, action),
    },
    
  };
};
