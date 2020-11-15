import { Api, ShuttlesApi } from '../modules';

export const TownhubApi = new Api();

export const Shuttles = new ShuttlesApi(TownhubApi);

