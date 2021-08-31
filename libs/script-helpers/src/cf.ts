import { CloudFormation } from 'aws-sdk';

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

interface StackConfiguration {
  /** The name of the stack to search for */
  name: string;
  databaseDetails: DatabaseDetail[];
}

export const setTableNamesFromStack = async (config: StackConfiguration[]) => {
  const CF = new CloudFormation();

  // For each of the configs we set the env variables required
  for (const stackConfig of config) {
    const stack = await CF.describeStacks({
      StackName: stackConfig.name,
    }).promise();

    stack.Stacks?.forEach((stack) => {
      setEnvVars(stackConfig.databaseDetails, stack.Outputs);
    });
  }
};
