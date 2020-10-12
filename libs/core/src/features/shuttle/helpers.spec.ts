import {
  getDepartureTimesFromStopList,
  getScheduleStartTimesForDayOfWeek,
  generateStopSchedulesForDate,
  getStopIdsFromRouteList,
} from './helpers';
import {
  Route,
  RouteStop,
  RouteStopDepartureTime,
  Schedule,
  Stop,
  StopSchedule,
} from './interfaces';
import { DateTime } from 'luxon';
import { DEFAULT_TIMEZONE } from '../../helpers';

describe('shuttle helpers', () => {
  describe('getStopIdsFromRouteList', () => {
    it('should return the correct list of stopIds', () => {
      const routeList = [
        {
          stopList: [
            { stopId: 'stop-1' },
            { stopId: 'stop-3' },
            { stopId: 'stop-4' },
            { stopId: 'stop-5' },
          ],
        },
        {
          stopList: [
            { stopId: 'stop-1' },
            { stopId: 'stop-2' },
            { stopId: 'stop-5' },
            { stopId: 'stop-6' },
          ],
        },
        ,
        {
          stopList: [
            { stopId: 'stop-2' },
            { stopId: 'stop-5' },
            { stopId: 'stop-3' },
            { stopId: 'stop-5' },
          ],
        },
      ] as Route[];

      const result = getStopIdsFromRouteList(routeList);
      const expected = [
        'stop-1',
        'stop-2',
        'stop-3',
        'stop-4',
        'stop-5',
        'stop-6',
      ];
      expect(result.sort()).toEqual(expected.sort());
    });
  });
  describe('getScheduleStartTimesForDayOfWeek', () => {
    const schedule = {
      startTimes: [
        { startTimeMinutes: 20, daysInOperation: [1, 4, 5] },
        { startTimeMinutes: 10, daysInOperation: [1, 3, 5] },
        { startTimeMinutes: 5, daysInOperation: [2, 5] },
        { startTimeMinutes: 5, daysInOperation: [5] },
      ],
    } as Schedule;
    it('should return the correct startTimes in ascending order', () => {
      const result = getScheduleStartTimesForDayOfWeek(schedule, 1);
      const expected = [10, 20];

      expect(result).toEqual(expected);
    });

    it('should return an empty array if none is found', () => {
      const result = getScheduleStartTimesForDayOfWeek(schedule, 7);

      expect(result).toEqual([]);
    });

    it('should return a unique set if there are multiple similar start times', () => {
      const result = getScheduleStartTimesForDayOfWeek(schedule, 5);
      const expected = [5, 10, 20];

      expect(result).toEqual(expected);
    });
  });

  describe('getDepartureTimesFromStopList', () => {
    it('should return the correct set of departure times', () => {
      const stopList: RouteStop[] = [
        { stopId: '1', legMinutes: 0 },
        { stopId: '2', legMinutes: 3 },
        { stopId: '3', legMinutes: 4 },
        { stopId: '4', legMinutes: 3 },
        { stopId: '5', legMinutes: 15 },
        { stopId: '6', legMinutes: 10 },
      ];

      const result = getDepartureTimesFromStopList(30, stopList);
      const expected: RouteStopDepartureTime[] = [
        { stopId: '1', departureTimeMinutes: 30 },
        { stopId: '2', departureTimeMinutes: 33 },
        { stopId: '3', departureTimeMinutes: 37 },
        { stopId: '4', departureTimeMinutes: 40 },
        { stopId: '5', departureTimeMinutes: 55 },
        { stopId: '6', departureTimeMinutes: 65 },
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('generateStopSchedulesForDate', () => {
    const schedules: Schedule[] = [
      {
        routeId: 'route-1',
        startTimes: [
          { startTimeMinutes: 20, daysInOperation: [1, 3, 4] },
          { startTimeMinutes: 50, daysInOperation: [1, 3, 4] },
          { startTimeMinutes: 80, daysInOperation: [2, 3, 4] },
        ],
      } as Schedule,
    ];
    const routes: Route[] = [
      {
        id: 'route-1',
        stopList: [
          { stopId: 'stop-1', legMinutes: 0 },
          { stopId: 'stop-2', legMinutes: 3 },
          { stopId: 'stop-3', legMinutes: 5 },
          { stopId: 'stop-4', legMinutes: 10 },
          { stopId: 'stop-1', legMinutes: 4 },
        ],
      } as Route,
    ];
    const stops: Stop[] = [
      {
        id: 'stop-1',
        townId: 'town-1',
        name: 'Stop 1',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        id: 'stop-2',
        townId: 'town-1',
        name: 'Stop 2',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        id: 'stop-3',
        townId: 'town-1',
        name: 'Stop 3',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        id: 'stop-4',
        townId: 'town-1',
        name: 'Stop 4',
        createdAt: 0,
        updatedAt: 0,
      },
    ];
    const timestamp = DateTime.fromMillis(1602530054192).setZone(
      DEFAULT_TIMEZONE
    );
    it('should return correct set of stop schedules', () => {
      const result = generateStopSchedulesForDate(
        schedules,
        routes,
        stops,
        timestamp
      );

      const expected: StopSchedule[] = [
        {
          id: 'stop-1',
          townId: 'town-1',
          name: 'Stop 1',
          createdAt: 0,
          updatedAt: 0,
          scheduleDate: timestamp.valueOf(),
          schedule: {
            'route-1': [20, 42, 50, 72],
          },
        },
        {
          id: 'stop-2',
          townId: 'town-1',
          name: 'Stop 2',
          createdAt: 0,
          updatedAt: 0,
          scheduleDate: timestamp.valueOf(),
          schedule: {
            'route-1': [23, 53],
          },
        },
        {
          id: 'stop-3',
          townId: 'town-1',
          name: 'Stop 3',
          createdAt: 0,
          updatedAt: 0,
          scheduleDate: timestamp.valueOf(),
          schedule: {
            'route-1': [28, 58],
          },
        },
        {
          id: 'stop-4',
          townId: 'town-1',
          name: 'Stop 4',
          createdAt: 0,
          updatedAt: 0,
          scheduleDate: timestamp.valueOf(),
          schedule: {
            'route-1': [38, 68],
          },
        },
      ];

      expect(result).toEqual(expected);
    });

    it('should return an empty array when routes are not provided and send out a warning', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      const result = generateStopSchedulesForDate(
        schedules,
        [],
        stops,
        timestamp
      );

      const expected: StopSchedule[] = [];

      expect(result).toEqual(expected);
      expect(console.warn).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });

    it('should return some of the stops when stops are not provided and send out a warning', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      const result = generateStopSchedulesForDate(
        schedules,
        routes,
        // Remove stop-2 and stop-4 from the list
        stops.filter((val) => !['stop-2', 'stop-4'].includes(val.id)),
        timestamp
      );

      const expected: StopSchedule[] = [
        {
          id: 'stop-1',
          townId: 'town-1',
          name: 'Stop 1',
          createdAt: 0,
          updatedAt: 0,
          scheduleDate: timestamp.valueOf(),
          schedule: {
            'route-1': [20, 42, 50, 72],
          },
        },
        {
          id: 'stop-3',
          townId: 'town-1',
          name: 'Stop 3',
          createdAt: 0,
          updatedAt: 0,
          scheduleDate: timestamp.valueOf(),
          schedule: {
            'route-1': [28, 58],
          },
        },
      ];

      expect(result).toEqual(expected);
      expect(console.warn).toHaveBeenCalledTimes(4);

      spy.mockRestore();
    });
  });
});
