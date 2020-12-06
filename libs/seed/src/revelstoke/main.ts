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
import { setTableNamesFromStack } from '../helpers';
import stopsData from './data/stops.json';
import routesData from './data/routes.json';
import schedulesInboundData from './data/schedules-inbound.json';
import schedulesOutboundData from './data/schedules-outbound.json';
import schedulesNordicData from './data/schedules-nordic.json';

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

  const createdStops: Stop[] = [];
  const createdRoutes: Route[] = [];

  const addStop = async (stop: typeof stopsData[0]) => {
    const newStop = await Stops.create({
      name: stop.name,
      townId,
      point: stop.point,
    });
    createdStops.push(newStop);
  };

  await Promise.all(stopsData.map(addStop));

  const findStop = (oldStopId: string) => {
    const stopData = stopsData.find((val) => val.id === oldStopId);
    return createdStops.find((val) => val.name === stopData?.name);
  };

  const findRoute = (oldRouteId: string) => {
    const routeData = routesData.find((val) => val.id === oldRouteId);
    return createdRoutes.find(
      (val) =>
        val.name === routeData?.name &&
        val.stopList.length === routeData?.stops.length
    );
  };

  const addRoute = async (route: typeof routesData[0]) => {
    const stopList = route.stops.map((val) => {
      const actualStop = findStop(val.stop);
      return {
        stopId: actualStop?.id ?? val.stop,
        legMinutes: val.legMinutes,
      };
    });
    const newRoute = await Routes.create({
      townId,
      name: route.name,
      description: route.description,
      stopList,
    });

    createdRoutes.push(newRoute);
  };

  await Promise.all(routesData.map(addRoute));

  const addSchedule = async (schedule: typeof schedulesInboundData[0]) => {
    const route = findRoute(schedule.routeId);
    await Schedules.create({
      townId,
      routeId: route?.id ?? '',
      startDate: schedule.startDate,
      endDate: schedule.endDate,
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
    });
  };

  await Promise.all(schedulesInboundData.map(addSchedule));
  await Promise.all(schedulesOutboundData.map(addSchedule));
  await Promise.all(schedulesNordicData.map(addSchedule));
};

main();
