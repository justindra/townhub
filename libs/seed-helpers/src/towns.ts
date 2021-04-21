#!/usr/bin/env ts-node-script

import * as AWS from 'aws-sdk';

// We have to do this before importing the databases so that it
// instantiates with the correct region
AWS.config.update({
  region: 'us-west-2',
});

import { TOWNS_DATABASE, TownsDatabase } from '@townhub-libs/towns';
import { setTableNamesFromStack } from './helpers';

/** Input the list of towns as a seed */
const main = async () => {
  await setTableNamesFromStack([
    {
      name: 'dev-townhub-infra-cdk-module-town',
      databaseDetails: [TOWNS_DATABASE],
    },
  ]);
  const Towns = new TownsDatabase();

  await Towns.create({
    hid: 'fernie',
    timezone: 'America/Denver',
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
