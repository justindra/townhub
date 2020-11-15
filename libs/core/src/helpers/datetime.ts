import { DateTime } from 'luxon';

export const DEFAULT_TIMEZONE = 'America/Los_Angeles';
export const DEFAULT_DATE_FORMAT = 'y-LL-dd';

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
    startOfDayValue: startOfDay.valueOf(),
    startOfDay: startOfDay,
    middleOfDayValue: middleOfDay.valueOf(),
    middleOfDay: middleOfDay,
    endOfDayValue: endOfDay.valueOf(),
    endOfDay: endOfDay,
  };
};


/**
 * Given a timestamp and a timezone, return the date in a YYYY-MM-DD format
 * @param timestamp The timestamp to check
 * @param timezone The timezone to check
 */
export const getDate = (
  timestamp: number,
  timezone: string = DEFAULT_TIMEZONE
): string => {
  return DateTime.fromMillis(timestamp)
    .setZone(timezone)
    .toFormat(DEFAULT_DATE_FORMAT);
};