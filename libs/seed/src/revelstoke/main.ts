#!/usr/bin/env ts-node-script

import * as AWS from 'aws-sdk';

// We have to do this before importing the databases so that it
// instantiates with the correct region
AWS.config.update({
  region: 'us-west-2',
});

import {
  Shuttles as ShuttlesModule,
  Towns as TownsModule,
} from '@townhub-libs/core';
import { setTableNamesFromStack } from '../helpers';
import stopsData from './data/stops.json';
import routesData from './data/routes.json';
import schedulesInboundData from './data/schedules-inbound.json';
import schedulesOutboundData from './data/schedules-outbound.json';
import schedulesNordicData from './data/schedules-nordic.json';

const main = async () => {
  await setTableNamesFromStack([
    {
      name: 'dev-townhub-infra-cdk-module-shuttle',
      databaseDetails: [
        ShuttlesModule.SHUTTLES_DATABASES.STOP,
        ShuttlesModule.SHUTTLES_DATABASES.ROUTE,
        ShuttlesModule.SHUTTLES_DATABASES.SCHEDULE,
        ShuttlesModule.SHUTTLES_DATABASES.DAILY_SCHEDULE,
      ],
    },
    {
      name: 'dev-townhub-infra-cdk-module-town',
      databaseDetails: [TownsModule.TOWNS_DATABASE],
    },
  ]);
  const Towns = new TownsModule.TownsDatabase();
  const Stops = new ShuttlesModule.StopsDatabase();
  const Routes = new ShuttlesModule.RoutesDatabase();
  const Schedules = new ShuttlesModule.SchedulesDatabase();

  const town = await Towns.getByHid('revelstoke');

  const townId = town.id;

  const createdStops: ShuttlesModule.Stop[] = [];
  const createdRoutes: ShuttlesModule.Route[] = [];

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
