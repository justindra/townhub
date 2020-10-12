import { getDailyData } from '@townhub-libs/core/features/shuttle';
import { DailyData } from '@townhub-libs/core/features/shuttle/interfaces';
import { ApiGatewayWrapper } from '@townhub-libs/core/wrappers';

/**
 * Gets the daily data for a town's shuttle service
 */
export const main = ApiGatewayWrapper<DailyData, { timestamp: number }>(
  async ({ townId, pathParameters: { timestamp } }) => {
    // TODO: Set the timezone to be the town's timezone rather than default
    const dailyData = await getDailyData(townId, timestamp);
    return {
      message: 'Found some daily data',
      data: dailyData,
    };
  }
);
