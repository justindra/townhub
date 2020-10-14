#!/usr/bin/env ts-node-script

import * as AWS from 'aws-sdk';

// We have to do this before importing the databases so that it
// instantiates with the correct region
AWS.config.update({
  region: 'us-west-2',
});

import {
  SHUTTLES_DATABASES,
  TOWNS_DATABASE,
  TownsDatabase,
} from '@townhub-libs/core';
import { setTableNamesFromStack } from './helpers';

const main = async () => {
  await setTableNamesFromStack([
    {
      name: 'dev-townhub-infra-cdk-module-shuttle',
      databaseDetails: [
        SHUTTLES_DATABASES.STOP,
        SHUTTLES_DATABASES.ROUTE,
        SHUTTLES_DATABASES.SCHEDULE,
        SHUTTLES_DATABASES.DAILY_SCHEDULE,
      ],
    },
    {
      name: 'dev-townhub-infra-cdk-module-town',
      databaseDetails: [TOWNS_DATABASE],
    },
  ]);
  const Towns = new TownsDatabase();

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
