import { Api, TownhubApiResponse } from '../base';
import { DailyData } from '@townhub-libs/core';

export class ShuttlesApi {
  constructor(private api: Api) {}

  async getDailyData(timestamp: number = new Date().valueOf()) {
    const res = await this.api.get<TownhubApiResponse<DailyData>>(
      `/shuttles/daily/${timestamp}`
    );
    return res.data;
  }
}
