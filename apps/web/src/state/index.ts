import React, { useContext } from 'react';
// TODO: Not sure why, but Webpack complains here and won't let us use the
// export from modules
import { ShuttlesApi } from '../modules/shuttles';
import { TownsApi } from '../modules/towns';
import { VendorsApi } from '../modules/vendors';
import { Api } from '../modules';

export const TownhubApi = new Api();

export const Shuttles = new ShuttlesApi(TownhubApi);
export const Towns = new TownsApi(TownhubApi);
export const Vendors = new VendorsApi(TownhubApi);

export const DEFAULT_CONTEXT_VALUE = {
  Shuttles,
  Towns,
  Vendors
};

const TownhubContext = React.createContext(DEFAULT_CONTEXT_VALUE);

TownhubContext.displayName = 'townhub';

export const TownhubProvider = TownhubContext.Provider;

export const TownhubConsumer = TownhubContext.Consumer;

export const useTownhub = () => useContext(TownhubContext);
