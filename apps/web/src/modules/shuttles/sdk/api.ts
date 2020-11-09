import { DailyData } from "@townhub-libs/core";
import { BaseApiParameters } from "../../base";

export class ShuttlesAPI {
  getDailyData({
    townId,
    timestamp
  }: BaseApiParameters<{
    timestamp: number
  }>): DailyData {
    // Go call the api here
    return {
      id: '1',
      timestamp: '2020-11-08',
      townId,
      stops: [],
      schedules: [],
      routes: [],
      createdAt: 1,
      updatedAt: 1
    }
  }
}