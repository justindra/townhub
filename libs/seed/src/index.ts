#!/usr/bin/env ts-node-script

import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-west-2',
});

import { StopDatabase, DailyScheduleDatabase } from '@townhub-libs/core';
import { setTableNames } from './helpers';

const main = async () => {
  await setTableNames();

  const Stop = new StopDatabase();
  const DailySchedule = new DailyScheduleDatabase();

  console.log(await Stop.list());
  console.log(await DailySchedule.list());
};

main();
