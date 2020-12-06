import { ApiGatewayWrapper } from '@townhub-libs/core';
import { DailyData, getDailyData } from '@townhub-libs/shuttles';
/**
 * Gets the daily data for a town's shuttle service
 */
export const main = ApiGatewayWrapper<DailyData, { timestamp: string }>(
  async ({ townId, pathParameters: { timestamp } }) => {
    const timestampNumber = parseInt(timestamp);
    // TODO: Set the timezone to be the town's timezone rather than default
    const dailyData = await getDailyData(townId, timestampNumber);
    return {
      message: 'Found some daily data',
      data: dailyData,
    };
  }
);
