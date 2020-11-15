import { ApiGatewayWrapper, Shuttles } from '@townhub-libs/core';

/**
 * Gets the daily data for a town's shuttle service
 */
export const main = ApiGatewayWrapper<Shuttles.DailyData, { timestamp: string }>(
  async ({ townId, pathParameters: { timestamp } }) => {
    const timestampNumber = parseInt(timestamp);
    // TODO: Set the timezone to be the town's timezone rather than default
    const dailyData = await Shuttles.getDailyData(townId, timestampNumber);
    return {
      message: 'Found some daily data',
      data: dailyData,
    };
  }
);
