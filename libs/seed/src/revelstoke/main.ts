#!/usr/bin/env ts-node-script

import * as AWS from 'aws-sdk';

// We have to do this before importing the databases so that it
// instantiates with the correct region
AWS.config.update({
  region: 'us-west-2',
});

import { TOWNS_DATABASE, TownsDatabase } from '@townhub-libs/towns';
import {
  SHUTTLES_DATABASES,
  StopsDatabase,
  RoutesDatabase,
  SchedulesDatabase,
  Stop,
  Route,
} from '@townhub-libs/shuttles';
import { DateTime } from 'luxon';
import { isEqual } from 'lodash';
import { setTableNamesFromStack } from '../helpers';
import stopsData from './data/stops.json';
import routesData from './data/routes.json';
import schedulesInboundData from './data/schedules-inbound.json';
import schedulesOutboundData from './data/schedules-outbound.json';
import schedulesNordicData from './data/schedules-nordic.json';
import { hasSameStops } from './helpers';

const main = async () => {
  await setTableNamesFromStack([
    {
      name: 'prod-townhub-infra-cdk-module-shuttle',
      databaseDetails: [
        SHUTTLES_DATABASES.STOP,
        SHUTTLES_DATABASES.ROUTE,
        SHUTTLES_DATABASES.SCHEDULE,
        SHUTTLES_DATABASES.DAILY_SCHEDULE,
      ],
    },
    {
      name: 'prod-townhub-infra-cdk-module-town',
      databaseDetails: [TOWNS_DATABASE],
    },
  ]);
  const Towns = new TownsDatabase();
  const Stops = new StopsDatabase();
  const Routes = new RoutesDatabase();
  const Schedules = new SchedulesDatabase();

  const town = await Towns.getByHid('revelstoke');

  const townId = town.id;

  const createdStops: (Stop & { oldStopId: string })[] = [];
  const createdRoutes: (Route & { oldRouteId: string })[] = [];

  // Get the list of the current items in the Database
  const currentStops = await Stops.listByTown(town.id);
  const currentRoutes = await Routes.listByTown(town.id);
  const currentSchedules = await Schedules.listByTown(town.id);

  const addStop = async (stop: typeof stopsData[0]) => {
    const existingStop = currentStops.find(
      (val) =>
        val.point.lat === stop.point.lat && val.point.lng === stop.point.lng
    );
    if (existingStop) {
      const updatedStop = await Stops.update(existingStop.id, {
        name: stop.name,
      });
      createdStops.push({ ...updatedStop, oldStopId: stop.id });
      return;
    }

    const newStop = await Stops.create({
      name: stop.name,
      townId,
      point: stop.point,
    });
    createdStops.push({ ...newStop, oldStopId: stop.id });
  };

  await Promise.all(stopsData.map(addStop));

  const findStop = (oldStopId: string) => {
    return createdStops.find((val) => val.oldStopId === oldStopId);
  };

  const findRoute = (oldRouteId: string) => {
    return createdRoutes.find((val) => val.oldRouteId === oldRouteId);
  };

  const addRoute = async (route: typeof routesData[0]) => {
    const stopList = route.stops.map((val) => {
      const actualStop = findStop(val.stop);
      return {
        stopId: actualStop?.id ?? val.stop,
        legMinutes: val.legMinutes,
      };
    });

    const existingRoute = currentRoutes.find((val) =>
      hasSameStops(val.stopList, stopList)
    );
    if (existingRoute) {
      // Just update the name and description if required
      const updatedRoute = await Routes.update(existingRoute.id, {
        name: route.name,
        description: route.description,
      });
      createdRoutes.push({ ...updatedRoute, oldRouteId: route.id });
      return;
    }

    const newRoute = await Routes.create({
      townId,
      name: route.name,
      description: route.description,
      stopList,
    });

    createdRoutes.push({ ...newRoute, oldRouteId: route.id });
  };

  await Promise.all(routesData.map(addRoute));

  const addSchedule = async (schedule: typeof schedulesNordicData[0]) => {
    const convertedSchedule = {
      ...schedule,
      startDate: DateTime.fromISO(schedule.startDate).startOf('day').valueOf(),
      endDate: DateTime.fromISO(schedule.endDate).endOf('day').valueOf(),
      startTimes: schedule.startTimes.map((val) => {
        const hiddenStops = val.hiddenStops
          ? val.hiddenStops.map((oldStopId) => {
              const stop = findStop(oldStopId);
              if (stop) return stop.id;
              return oldStopId;
            })
          : [];
        return {
          daysInOperation: val.daysInOperation,
          startTimeMinutes: val.startTimeHour * 60 + val.startTimeMinute,
          hiddenStops,
        };
      }),
    };

    const route = findRoute(schedule.routeId);

    const existingSchedule = currentSchedules.find(
      (val) =>
        val.startDate === convertedSchedule.startDate &&
        val.endDate === convertedSchedule.endDate &&
        isEqual(val.startTimes, convertedSchedule.startTimes)
    );

    if (existingSchedule) {
      return;
    }

    console.log('creating a new schedule...', schedule.routeId);

    await Schedules.create({
      townId,
      routeId: route?.id ?? '',
      startDate: convertedSchedule.startDate,
      endDate: convertedSchedule.endDate,
      startTimes: convertedSchedule.startTimes,
    });
  };

  await Promise.all(schedulesInboundData.map(addSchedule));
  await Promise.all(schedulesOutboundData.map(addSchedule));
  await Promise.all(schedulesNordicData.map(addSchedule));
};

main();
