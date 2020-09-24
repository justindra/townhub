#!/usr/bin/env node

'use strict';

const fs = require('fs');
const { execSync } = require('child_process');

// Get the AWS_PROFILE from the arguments
const args = process.argv.slice(2);
const AWS_PROFILE = args[0];

// Use the Parameter Index and run the deploy
fs.copyFileSync('lib/index.parameter.ts', 'lib/index.ts');
execSync(`yarn sst cdk --app=build.run.js destroy --profile ${AWS_PROFILE}`);

// Use the SSL Index and run the deploy
fs.copyFileSync('lib/index.ssl.ts', 'lib/index.ts');
execSync(
  `yarn sst cdk --app=build.run.js destroy --region us-east-1 --profile ${AWS_PROFILE}`
);

// Remove the index.ts to make sure we don't use that manually
fs.unlinkSync('lib/index.ts');
