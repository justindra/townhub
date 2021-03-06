import { Api, TownhubApiResponse } from '../base';
import { Town } from '@townhub-libs/towns';

export class TownsApi {
  constructor(private api: Api) {}

  async getByHid(townHid: string) {
    const res = await this.api.get<TownhubApiResponse<Town>>(
      `/towns/hid/${townHid}`
    );
    return res.data;
  }

  /**
   * Set the Town Id for the API from the URL
   * using the subdomain as the Town HID
   */
  async setTownIdFromUrl() {
    const host = window.location.hostname;
    let townHid = 'revelstoke';
    if (host !== 'localhost') {
      townHid = host.split('.')[0];
    }
    try {
      const res = await this.getByHid(townHid);
      this.api.updateTownId((res as any).id);

      return res;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}
