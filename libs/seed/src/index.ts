#!/usr/bin/env ts-node-script

import * as AWS from 'aws-sdk';

// We have to do this before importing the databases so that it
// instantiates with the correct region
AWS.config.update({
  region: 'us-west-2',
});

import {
  Shuttles as ShuttlesModule,
  Towns as TownsModule
} from '@townhub-libs/core';
import { setTableNamesFromStack } from './helpers';

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

  await Towns.create({
    hid: 'fernie',
    timezone: 'America/Los_Angeles',
    name: 'Fernie',
    modules: [
      {
        name: 'shuttles',
      },
    ],
  });

  await Towns.create({
    hid: 'revelstoke',
    timezone: 'America/Los_Angeles',
    name: 'Revelstoke',
    modules: [
      {
        name: 'shuttles',
      },
    ],
  });
};

main();
