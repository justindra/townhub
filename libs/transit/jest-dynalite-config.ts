import {
  TableConfiguration,
  generateJestDynaliteConfig,
  setEnvVariablesFromTableConfig,
} from '../../build/jest-dynalite.config';
import { TransitDatabaseEnv } from './src/constants';

export const tableConfigurations: TableConfiguration[] = [
  {
    TableName: 'agencies',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    EnvVariableName: TransitDatabaseEnv.Agencies,
  },
];

// Set the env vars
setEnvVariablesFromTableConfig(tableConfigurations);

export default generateJestDynaliteConfig(tableConfigurations);
