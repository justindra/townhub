import { CloudFormation } from 'aws-sdk';
import { SHUTTLE_DATABASES } from '@townhub-libs/core';

interface DatabaseDetail {
  ENV: string;
  CF_OUTPUT: string;
}

const setEnvVars = (
  details: DatabaseDetail[],
  outputs?: CloudFormation.Outputs
) => {
  details.forEach((detail) => {
    const tableName = outputs?.find(
      (output) => output.OutputKey === detail.CF_OUTPUT
    )?.OutputValue;
    if (!tableName) return;
    process.env[detail.ENV] = tableName;
  });
};

export const setTableNames = async () => {
  const CF = new CloudFormation();

  const shuttleStack = await CF.describeStacks({
    // TODO: Update to use stage properly
    StackName: 'dev-townhub-infra-cdk-FeatureShuttleStack',
  }).promise();

  shuttleStack.Stacks?.forEach((stack) => {
    const details: DatabaseDetail[] = [
      SHUTTLE_DATABASES.STOP,
      SHUTTLE_DATABASES.ROUTE,
      SHUTTLE_DATABASES.SCHEDULE,
      SHUTTLE_DATABASES.DAILY_SCHEDULE,
    ];

    setEnvVars(details, stack.Outputs);
  });
};
