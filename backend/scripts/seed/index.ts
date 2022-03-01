#!/usr/bin/env ts-node-script

import * as AWS from 'aws-sdk';

// We have to do this before importing the databases so that it
// instantiates with the correct region
AWS.config.update({
  region: 'us-west-2',
});

import {
  AgenciesTable,
  CalendarsTable,
  RoutesTable,
  RouteType,
  StopsTable,
} from '@townhub/core/transit';
import { setTableNamesFromStack } from '../helpers';
import CalendarsData from './data/calendars.json';
import RoutesData from './data/routes.json';
import StopsData from './data/stops.json';

const main = async () => {
  await setTableNamesFromStack([
    {
      name: 'dev-townhub-StaticStack',
      databaseDetails: [
        { ENV: 'DATABASE_NAME', CF_OUTPUT: 'DatabaseName' },
        { ENV: 'DATABASE_CLUSTER_ARN', CF_OUTPUT: 'DatabaseClusterArn' },
        { ENV: 'DATABASE_SECRET_ARN', CF_OUTPUT: 'DatabaseSecretArn' },
      ],
    },
  ]);

  const AgenciesClient = new AgenciesTable();
  const CalendarsClient = new CalendarsTable();
  const RoutesClient = new RoutesTable();
  const StopsClient = new StopsTable();
  const res = await AgenciesClient.create(
    {
      imported_id: 'everything-revelstoke',
      name: 'Everything Revelstoke',
      url: 'https://everythingrevelstoke.com/',
      timezone: 'America/Vancouver',
    },
    null
  );

  // Add the stops
  for (const stop of StopsData) {
    await StopsClient.create(
      {
        name: stop.name,
        imported_id: stop.id,
        point: { lat: stop.point.lat, lon: stop.point.lng },
      },
      null
    );
  }

  // Add the routes
  for (const route of RoutesData) {
    await RoutesClient.create(
      {
        route_short_name: route.route_short_name,
        route_long_name: route.route_long_name,
        route_desc: route.route_desc,
        route_type: RouteType.Bus,
        imported_id: route.route_id,
        agency_id: res.id,
      },
      null
    );
  }

  // Add the services from calendars
  for (const calendar of CalendarsData) {
    await CalendarsClient.create(
      {
        imported_id: calendar.service_id,
        service_name: calendar.service_name,
        start_date: calendar.start_date,
        end_date: calendar.end_date,
        monday: calendar.monday,
        tuesday: calendar.tuesday,
        wednesday: calendar.wednesday,
        thursday: calendar.thursday,
        friday: calendar.friday,
        saturday: calendar.saturday,
        sunday: calendar.sunday,
      },
      null
    );
  }
};

main();
