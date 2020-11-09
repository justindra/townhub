import { BaseEffect, BaseOfflineAction } from '../modules';
import { ShuttlesAPI } from '../modules/shuttles/sdk/api';

export class TownhubApi {
  Shuttles: ShuttlesAPI;

  constructor() {
    this.Shuttles = new ShuttlesAPI();
  }
}

const API = new TownhubApi();

/**
 * The configuration of the effect used for redux-offline
 * @param effect The effect config to use
 * @param action The action that called this effect
 */
export const effectConfig = async (
  effect: BaseEffect<keyof TownhubApi>,
  action: BaseOfflineAction
) => {
  return (API[effect.module] as any)[effect.method]({
    ...effect.params,
    townId: action.townId,
  });
};
