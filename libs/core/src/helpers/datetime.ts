import { DateTime } from 'luxon';

export const DEFAULT_TIMEZONE = 'America/Los_Angeles';

/**
 * Get the whole day's timestamp range
 * @param timestamp The timestamp to use to find today's time
 * @param timezone The timezone to use
 */
export const getDayDateRange = (
  timestamp: number,
  timezone: string = DEFAULT_TIMEZONE
) => {
  const currentTime = DateTime.fromMillis(timestamp).setZone(timezone);

  const startOfDay = currentTime.startOf('day');
  const middleOfDay = startOfDay.plus({ hours: 12 });
  const endOfDay = currentTime.endOf('day');

  return {
    startOfDay: startOfDay.valueOf(),
    middleOfDay: middleOfDay.valueOf(),
    endOfDay: endOfDay.valueOf(),
  };
};
