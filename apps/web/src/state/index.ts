import React, { useContext } from 'react';
import { Api, ShuttlesApi, TownsApi } from '../modules';

export const TownhubApi = new Api();

export const Shuttles = new ShuttlesApi(TownhubApi);
export const Towns = new TownsApi(TownhubApi);

export const DEFAULT_CONTEXT_VALUE = {
  Shuttles,
  Towns
}

const TownhubContext = React.createContext(DEFAULT_CONTEXT_VALUE);

TownhubContext.displayName = 'townhub';

export const TownhubProvider = TownhubContext.Provider;

export const TownhubConsumer = TownhubContext.Consumer;

export const useTownhub = () => useContext(TownhubContext);