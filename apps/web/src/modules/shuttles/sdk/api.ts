import { DailyData } from "@townhub-libs/core";

export class ShuttlesAPI {
  getDailyData(): DailyData {
    return {
      id: '1',
      timestamp: 1,
      townId: 'test',
      stops: [],
      schedules: [],
      routes: [],
      createdAt: 1,
      updatedAt: 1
    }
  }
}