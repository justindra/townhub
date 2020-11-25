import { Api, TownhubApiResponse } from '../base';
import { Shuttles } from '@townhub-libs/core';

export class ShuttlesApi {
  constructor(private api: Api) {}

  async getDailyData(timestamp: number = new Date().valueOf()) {
    const res = await this.api.get<TownhubApiResponse<Shuttles.DailyData>>(
      // `/shuttles/daily/${timestamp}`
      `/shuttles/daily/${1606501200000}`
    );
    return res.data;
  }
}
