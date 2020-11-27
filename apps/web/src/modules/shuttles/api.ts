import { Api, TownhubApiResponse } from '../base';
import { Shuttles } from '@townhub-libs/core';

export class ShuttlesApi {
  constructor(private api: Api) {}

  async getDailyData(timestamp: number = 1606501200000) {
    const res = await this.api.get<TownhubApiResponse<Shuttles.DailyData>>(
      `/shuttles/daily/${timestamp}`
    );
    return res.data;
  }
}
