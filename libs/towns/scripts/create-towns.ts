#!/usr/bin/env ts-node-script

import * as AWS from 'aws-sdk';

// We have to do this before importing the databases so that it
// instantiates with the correct region
AWS.config.update({
  region: 'us-west-2',
});

import { DEFAULT_ACTOR_ID } from '@townhub-libs/core';
import { setTableNamesFromStack } from '@townhub-libs/script-helpers';
import { TOWNS_DATABASE, TownsDatabase } from '../src';

const main = async () => {
  await setTableNamesFromStack([
    {
      name: 'dev-townhub-infra-cdk-module-town',
      databaseDetails: [TOWNS_DATABASE],
    },
  ]);
  const Towns = new TownsDatabase();

  await Towns.create(
    {
      hid: 'fernie',
      timezone: 'America/Los_Angeles',
      name: 'Fernie2',
      modules: [
        {
          name: 'shuttles',
        },
      ],
    } as any,
    DEFAULT_ACTOR_ID
  );

  await Towns.create(
    {
      hid: 'revelstoke',
      timezone: 'America/Los_Angeles',
      name: 'Revelstoke',
      modules: [
        {
          name: 'shuttles',
        },
      ],
    },
    DEFAULT_ACTOR_ID
  );
};

main();
