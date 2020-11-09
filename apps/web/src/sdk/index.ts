import { combineReducers, compose, createStore } from 'redux';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { townModulesReducer, TownModulesStoreState } from './reducers';
interface RootState {
  auth: {
    townId: string;
    townHid: string;
  },
  modulesByTownId: TownModulesStoreState
}

const reducer = combineReducers({
  modulesByTownId: townModulesReducer
})

// Allow redux-dev-tools in development
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

export const store = createStore(
  reducer,
  composeEnhancers(offline(offlineConfig))
);
