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

import { generateThumbnail } from '@townhub-libs/files';

const main = async () => {
  await generateThumbnail(
    'attachmentId',
    '118070047_907393979745883_8677776173942787241_n.jpg',
    200,
    200
  );  
};

main();
