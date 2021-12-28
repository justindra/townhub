import {
  TableConfiguration,
  generateJestDynaliteConfig,
  setEnvVariablesFromTableConfig,
} from '../../build/jest-dynalite.config';

export const tableConfigurations: TableConfiguration[] = [
  {
    TableName: 'test-table',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    EnvVariableName: 'TEST_TABLE_NAME',
  },
];

// Set the env vars
setEnvVariablesFromTableConfig(tableConfigurations);

export default generateJestDynaliteConfig(tableConfigurations);
