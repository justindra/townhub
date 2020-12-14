#!/usr/bin/env ts-node-script

import * as AWS from 'aws-sdk';

// Set the credentials
const credentials = new AWS.SharedIniFileCredentials({
  profile: 'townhub-dev',
});
AWS.config.credentials = credentials;

// We have to do this before importing the databases so that it
// instantiates with the correct region
AWS.config.update({
  region: 'us-west-2',
});

import { setTableNamesFromStack } from '@townhub-libs/seed-helpers';
import { TOWNS_DATABASE, TownsDatabase } from '@townhub-libs/towns';
import { VendorsDatabase, VENDORS_DATABASE } from '../src';
import { company, image, phone, internet, lorem } from 'faker';

const main = async () => {
  await setTableNamesFromStack([
    {
      name: 'dev-townhub-infra-cdk-module-vendor',
      databaseDetails: [VENDORS_DATABASE],
    },
    {
      name: 'dev-townhub-infra-cdk-module-town',
      databaseDetails: [TOWNS_DATABASE],
    },
  ]);

  const TownsClient = new TownsDatabase();
  const town = await TownsClient.getByHid('revelstoke');

  if (!town) {
    console.log('Unable to find town, skipping');
    return;
  }

  const VendorsClient = new VendorsDatabase();

  for (let i = 0; i < 10; i++) {
    await VendorsClient.create({
      townId: town.id,
      name: company.companyName(),
      description: lorem.paragraph(),
      logo: image.imageUrl(128, 128),
      links: [
        { type: 'facebook', url: internet.url(), name: 'Facebook' },
        { type: 'instagram', url: internet.url(), name: 'instagram' },
        { type: 'website', url: internet.url(), name: 'website' },
      ],
      images: [image.imageUrl(), image.imageUrl(), image.imageUrl()],
      phone: phone.phoneNumber(),
      email: internet.email(),
    });
  }
};

main();
