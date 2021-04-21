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
import {
  VendorCategory,
  VendorsDatabase,
  VENDORS_DATABASE,
  VENDOR_CATEGORIES,
} from '../src';
import { company, image, phone, internet, lorem, address } from 'faker';
import { sample } from 'lodash';

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

  const AvailableVendorCategories = [
    VENDOR_CATEGORIES.ARTISAN.name,
    VENDOR_CATEGORIES.FOOD_DRINKS.name,
    VENDOR_CATEGORIES.STORE.name,
  ];

  const getRandomVendorCategory = () => {
    return [sample(AvailableVendorCategories)] as VendorCategory[];
  };

  for (let i = 0; i < 10; i++) {
    await VendorsClient.create({
      townId: town.id,
      userId: 'unknown',
      name: company.companyName(),
      description: lorem.paragraph(),
      categories: getRandomVendorCategory(),
      logo: image.imageUrl(128, 128),
      links: [
        { type: 'facebook', url: internet.url(), name: 'Facebook' },
        { type: 'instagram', url: internet.url(), name: 'instagram' },
        { type: 'website', url: internet.url(), name: 'website' },
      ],
      images: [image.imageUrl(), image.imageUrl(), image.imageUrl()],
      phone: phone.phoneNumber(),
      email: internet.email(),
      address: address.streetAddress(),
      openingHours: [
        {
          dayOfWeek: 1,
          startHours: 9,
          startMinutes: 0,
          endHours: 21,
          endMinutes: 0,
        },
        {
          dayOfWeek: 2,
          startHours: 9,
          startMinutes: 0,
          endHours: 21,
          endMinutes: 0,
        },
        {
          dayOfWeek: 3,
          startHours: 9,
          startMinutes: 0,
          endHours: 21,
          endMinutes: 0,
        },
        {
          dayOfWeek: 4,
          startHours: 9,
          startMinutes: 0,
          endHours: 21,
          endMinutes: 0,
        },
        {
          dayOfWeek: 5,
          startHours: 9,
          startMinutes: 0,
          endHours: 21,
          endMinutes: 0,
        },
        {
          dayOfWeek: 6,
          startHours: 9,
          startMinutes: 0,
          endHours: 21,
          endMinutes: 0,
        },
      ],
    });
  }
};

main();
