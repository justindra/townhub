import type { DynamoDB } from 'aws-sdk';

export type TableConfiguration = DynamoDB.CreateTableInput & {
  EnvVariableName: string;
};

export const generateJestDynaliteConfig = (
  tableConfigurations: TableConfiguration[]
) => {
  return {
    tables: tableConfigurations.map((val) => ({
      TableName: val.TableName,
      KeySchema: val.KeySchema,
      AttributeDefinitions: val.AttributeDefinitions,
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    })),
    basePort: 8000,
  };
};
