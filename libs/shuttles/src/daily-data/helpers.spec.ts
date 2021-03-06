import {
  getDepartureTimesFromStopList,
  getScheduleStartTimesForDayOfWeek,
  generateStopSchedulesForDate,
  getStopIdsFromRouteList,
  convertRoutesToDailyDataRoutes,
} from './helpers';
import {
  Route,
  RouteStop,
  RouteStopDepartureTime,
  Schedule,
  Stop,
  StopSchedule,
} from '../interfaces';
import { DateTime } from 'luxon';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIMEZONE } from '@townhub-libs/core';

// To make sure things are sorted for the results
const sortById = (a: StopSchedule, b: StopSchedule) =>
  ('' + a.id).localeCompare(b.id);

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
        { startTimeMinutes: 20, daysInOperation: [1, 4, 5], hiddenStops: [] },
        { startTimeMinutes: 10, daysInOperation: [1, 3, 5], hiddenStops: [] },
        { startTimeMinutes: 5, daysInOperation: [2, 5], hiddenStops: [] },
        { startTimeMinutes: 5, daysInOperation: [5], hiddenStops: ['2', '3'] },
      ],
    } as Schedule;
    it('should return the correct startTimes in ascending order', () => {
      const result = getScheduleStartTimesForDayOfWeek(schedule, 1);
      const expected = [
        { startTimeMinutes: 10, daysInOperation: [1, 3, 5], hiddenStops: [] },
        { startTimeMinutes: 20, daysInOperation: [1, 4, 5], hiddenStops: [] },
      ];

      expect(result).toEqual(expected);
    });

    it('should return an empty array if none is found', () => {
      const result = getScheduleStartTimesForDayOfWeek(schedule, 7);

      expect(result).toEqual([]);
    });

    it('should return a unique set if there are multiple similar start times', () => {
      const result = getScheduleStartTimesForDayOfWeek(schedule, 5);
      const expected = [
        { startTimeMinutes: 5, daysInOperation: [2, 5], hiddenStops: [] },
        { startTimeMinutes: 10, daysInOperation: [1, 3, 5], hiddenStops: [] },
        { startTimeMinutes: 20, daysInOperation: [1, 4, 5], hiddenStops: [] },
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('getDepartureTimesFromStopList', () => {
    const stopList: RouteStop[] = [
      { stopId: '1', legMinutes: 0 },
      { stopId: '2', legMinutes: 3 },
      { stopId: '3', legMinutes: 4 },
      { stopId: '4', legMinutes: 3 },
      { stopId: '5', legMinutes: 15 },
      { stopId: '6', legMinutes: 10 },
    ];
    it('should return the correct set of departure times', () => {
      const result = getDepartureTimesFromStopList(30, stopList, []);
      const expected: RouteStopDepartureTime[] = [
        { stopId: '1', departureTimeMinutes: 30 },
        { stopId: '2', departureTimeMinutes: 33 },
        { stopId: '3', departureTimeMinutes: 37 },
        { stopId: '4', departureTimeMinutes: 40 },
        { stopId: '5', departureTimeMinutes: 55 },
      ];

      expect(result).toEqual(expected);
    });

    it('should return the corect set of departure times when hidden stop is at the start', () => {
      const result = getDepartureTimesFromStopList(30, stopList, ['1']);
      const expected: RouteStopDepartureTime[] = [
        { stopId: '2', departureTimeMinutes: 30 },
        { stopId: '3', departureTimeMinutes: 34 },
        { stopId: '4', departureTimeMinutes: 37 },
        { stopId: '5', departureTimeMinutes: 52 },
      ];
      expect(result).toEqual(expected);
    });

    it('should return the corect set of departure times with hidden stops in the middle', () => {
      const result = getDepartureTimesFromStopList(30, stopList, ['2', '4']);
      const expected: RouteStopDepartureTime[] = [
        { stopId: '1', departureTimeMinutes: 30 },
        { stopId: '3', departureTimeMinutes: 37 },
        { stopId: '5', departureTimeMinutes: 55 },
      ];
      expect(result).toEqual(expected);
    });

    it('should return the corect set of departure times when hidden stop is at the end', () => {
      const result = getDepartureTimesFromStopList(30, stopList, ['6']);
      const expected: RouteStopDepartureTime[] = [
        { stopId: '1', departureTimeMinutes: 30 },
        { stopId: '2', departureTimeMinutes: 33 },
        { stopId: '3', departureTimeMinutes: 37 },
        { stopId: '4', departureTimeMinutes: 40 },
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('generateStopSchedulesForDate', () => {
    const schedules: Schedule[] = [
      {
        routeId: 'route-1',
        startTimes: [
          {
            startTimeMinutes: 20,
            daysInOperation: [1, 3, 4],
            hiddenStops: ['stop-1'],
          },
          { startTimeMinutes: 50, daysInOperation: [1, 3, 4] },
          { startTimeMinutes: 80, daysInOperation: [2, 3, 4] },
        ],
      } as Schedule,
    ];
    const routes: Route[] = [
      {
        id: 'route-1',
        name: 'Route 1',
        description: 'route 1 description',
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
        moduleId: 'transit-1',
        name: 'Stop 1',
        createdAt: 0,
        createdBy: 'system',
        entityType: 'stop',
        updatedAt: 0,
        updatedBy: 'system',
        point: { lat: 0, lng: 0 },
      },
      {
        id: 'stop-2',
        townId: 'town-1',
        moduleId: 'transit-1',
        name: 'Stop 2',
        createdAt: 0,
        createdBy: 'system',
        entityType: 'stop',
        updatedAt: 0,
        updatedBy: 'system',
        point: { lat: 0, lng: 0 },
      },
      {
        id: 'stop-3',
        townId: 'town-1',
        moduleId: 'transit-1',
        name: 'Stop 3',
        createdAt: 0,
        createdBy: 'system',
        entityType: 'stop',
        updatedAt: 0,
        updatedBy: 'system',
        point: { lat: 0, lng: 0 },
      },
      {
        id: 'stop-4',
        townId: 'town-1',
        moduleId: 'transit-1',
        name: 'Stop 4',
        createdAt: 0,
        createdBy: 'system',
        entityType: 'stop',
        updatedAt: 0,
        updatedBy: 'system',
        point: { lat: 0, lng: 0 },
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
          moduleId: 'transit-1',
          name: 'Stop 1',
          createdAt: 0,
          createdBy: 'system',
          entityType: 'stop',
          updatedAt: 0,
          updatedBy: 'system',
          scheduleDate: timestamp.toFormat(DEFAULT_DATE_FORMAT),
          routes: [
            {
              id: 'route-1',
              name: 'Route 1',
              description: 'route 1 description',
              schedule: [50],
            },
          ],
          point: { lat: 0, lng: 0 },
        },
        {
          id: 'stop-2',
          townId: 'town-1',
          moduleId: 'transit-1',
          name: 'Stop 2',
          createdAt: 0,
          createdBy: 'system',
          entityType: 'stop',
          updatedAt: 0,
          updatedBy: 'system',
          scheduleDate: timestamp.toFormat(DEFAULT_DATE_FORMAT),
          routes: [
            {
              id: 'route-1',
              name: 'Route 1',
              description: 'route 1 description',
              schedule: [20, 53],
            },
          ],
          point: { lat: 0, lng: 0 },
        },
        {
          id: 'stop-3',
          townId: 'town-1',
          moduleId: 'transit-1',
          name: 'Stop 3',
          createdAt: 0,
          createdBy: 'system',
          entityType: 'stop',
          updatedAt: 0,
          updatedBy: 'system',
          scheduleDate: timestamp.toFormat(DEFAULT_DATE_FORMAT),
          routes: [
            {
              id: 'route-1',
              name: 'Route 1',
              description: 'route 1 description',
              schedule: [25, 58],
            },
          ],
          point: { lat: 0, lng: 0 },
        },
        {
          id: 'stop-4',
          townId: 'town-1',
          moduleId: 'transit-1',
          name: 'Stop 4',
          createdAt: 0,
          createdBy: 'system',
          entityType: 'stop',
          updatedAt: 0,
          updatedBy: 'system',
          scheduleDate: timestamp.toFormat(DEFAULT_DATE_FORMAT),
          routes: [
            {
              id: 'route-1',
              name: 'Route 1',
              description: 'route 1 description',
              schedule: [68],
            },
          ],
          point: { lat: 0, lng: 0 },
        },
      ];
      expect(result.sort(sortById)).toEqual(expected.sort(sortById));
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
          moduleId: 'transit-1',
          name: 'Stop 1',
          createdAt: 0,
          createdBy: 'system',
          updatedAt: 0,
          updatedBy: 'system',
          entityType: 'stop',
          scheduleDate: timestamp.toFormat(DEFAULT_DATE_FORMAT),
          routes: [
            {
              id: 'route-1',
              name: 'Route 1',
              description: 'route 1 description',
              schedule: [50],
            },
          ],
          point: { lat: 0, lng: 0 },
        },
        {
          id: 'stop-3',
          townId: 'town-1',
          moduleId: 'transit-1',
          name: 'Stop 3',
          createdAt: 0,
          createdBy: 'system',
          updatedAt: 0,
          updatedBy: 'system',
          entityType: 'stop',
          scheduleDate: timestamp.toFormat(DEFAULT_DATE_FORMAT),
          routes: [
            {
              id: 'route-1',
              name: 'Route 1',
              description: 'route 1 description',
              schedule: [25, 58],
            },
          ],
          point: { lat: 0, lng: 0 },
        },
      ];

      expect(result.sort(sortById)).toEqual(expected.sort(sortById));
      expect(console.warn).toHaveBeenCalledTimes(3);

      spy.mockRestore();
    });
  });

  describe('convertRoutesToDailyDataRoutes', () => {
    const route: Route = {
      createdAt: 1604903727734,
      createdBy: 'system',
      updatedBy: 'system',
      entityType: 'route',
      stopList: [
        {
          stopId: 'stop-1',
          legMinutes: 0,
        },
        {
          stopId: 'stop-2',
          legMinutes: 3,
        },
      ],
      name: 'Morning',
      description: 'The morning route',
      townId: '1eefd261-6b35-4f2a-8e44-fffec17b2f1a',
      moduleId: 'transit-1',
      id: '60ec0346-8f98-4451-9571-6a9ff17430c9',
      updatedAt: 1604903727734,
    };
    const stops: Stop[] = [
      {
        id: 'stop-1',
        townId: 'town-1',
        moduleId: 'transit-1',
        name: 'Stop 1',
        createdAt: 0,
        createdBy: 'system',
        updatedAt: 0,
        updatedBy: 'system',
        entityType: 'stop',
        point: { lat: 0, lng: 0 },
      },
      {
        id: 'stop-2',
        townId: 'town-1',
        moduleId: 'transit-1',
        name: 'Stop 2',
        createdAt: 0,
        createdBy: 'system',
        updatedAt: 0,
        updatedBy: 'system',
        entityType: 'stop',
        point: { lat: 1, lng: 1 },
      },
    ];
    it('should throw an error if a stop was not provided', () => {
      expect(() => convertRoutesToDailyDataRoutes([route], [stops[0]])).toThrow(
        'Please provide stop with id: stop-2'
      );
    });

    it('should return the correct details', () => {
      const expected = [
        {
          ...route,
          stopList: [
            {
              id: 'stop-1',
              stopId: 'stop-1',
              legMinutes: 0,
              point: { lat: 0, lng: 0 },
            },
            {
              id: 'stop-2',
              stopId: 'stop-2',
              legMinutes: 3,
              point: { lat: 1, lng: 1 },
            },
          ],
        },
      ];

      expect(convertRoutesToDailyDataRoutes([route], stops)).toEqual(expected);
    });
  });
});
