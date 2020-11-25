import { Shuttles } from "@townhub-libs/core";
import { DateTime } from 'luxon';

/** Get the next three scheduled times */
export const getNextThreeTimes = (stop: Shuttles.StopSchedule) => {
  const now = DateTime.local();
  const nowInMinutes = now.minute + 60 * now.hour;
  const timesList = stop.routes
    .map(val => val.schedule)
    // Merge into one array
    .reduce((prev, current) => current.concat(...prev), [])
    // Get the ones that are after now
    .filter((val) => val > nowInMinutes)
    // Sort it
    .sort()
    // Get the top 3
    .slice(0, 3);

  return timesList;
};

export const convertMinutesToTimeFormat = (val: number) => {
  return DateTime.local()
    .startOf('day')
    .plus({
      hours: Math.floor(val / 60),
      minutes: val % 60,
    })
    .toFormat('t');
};