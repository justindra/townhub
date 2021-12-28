import type { DynamoDB } from 'aws-sdk';

export type TableConfiguration = DynamoDB.CreateTableInput & {
  EnvVariableName: string;
};

export const generateJestDynaliteConfig = (
  tableConfigurations: TableConfiguration[]
) => {
  return {
    tables: tableConfigurations.map(({ EnvVariableName, ...val }) => ({
      ...val,
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    })),
    basePort: 8000,
  };
};

/**
 * Set the required ENV variables based on the given list of TableConfigurations
 * @param tableConfigurations
 */
export const setEnvVariablesFromTableConfig = (
  tableConfigurations: TableConfiguration[]
) => {
  tableConfigurations.forEach((table) => {
    process.env[table.EnvVariableName] = table.TableName;
  });
};
