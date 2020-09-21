#!/usr/bin/env node

'use strict';

const fs = require('fs');
const { execSync } = require('child_process');

// Get the AWS_PROFILE from the arguments
const args = process.argv.slice(2);
const AWS_PROFILE = args[0];

// Get the SST Config file
const rawdata = fs.readFileSync('sst.json');
const SstConfig = JSON.parse(rawdata);

// Workout the source stack name
const SourceStackName = `${SstConfig.stage}-${SstConfig.name}-SSLGlobalCertificateSource`;

// Use the SSL Index and run the deploy
fs.copyFileSync('lib/index.ssl.ts', 'lib/index.ts');
execSync(
  `yarn sst cdk --app=build.run.js deploy --region us-east-1 --profile ${AWS_PROFILE}`
);

// Get the CertificateARN from CF
const certificateArnBuffer = execSync(
  `aws cloudformation describe-stacks \
  --output text \
  --profile ${AWS_PROFILE} \
  --stack-name ${SourceStackName} \
  --query "Stacks[0].Outputs[0].OutputValue" \
  --region us-east-1`
);
// Remove any newline characters just in case
const certificateArn = certificateArnBuffer.toString().replace(/\r?\n|\r/g, '');

// Export it as an ENV Variable so the next deploy can use it
process.env.CERTIFICATE_ARN = certificateArn;

// Use the Parameter Index and run the deploy
fs.copyFileSync('lib/index.parameter.ts', 'lib/index.ts');
execSync(`yarn sst cdk --app=build.run.js deploy --profile ${AWS_PROFILE}`);

// Remove the index.ts to make sure we don't use that manually
fs.unlinkSync('lib/index.ts');
