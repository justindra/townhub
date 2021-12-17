import {
  TableConfiguration,
  generateJestDynaliteConfig,
  setEnvVariablesFromTableConfig,
} from '../../build/jest-dynalite.config';
import { TransitDatabaseEnv, DDB_INDEX_NAMES } from './src/constants';

export const tableConfigurations: TableConfiguration[] = [
  {
    TableName: 'agencies',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    EnvVariableName: TransitDatabaseEnv.Agencies,
  },
  {
    TableName: 'services',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      {
        AttributeName: 'agency_id',
        AttributeType: 'S',
      },
      { AttributeName: 'end_date', AttributeType: 'S' },
    ],
    EnvVariableName: TransitDatabaseEnv.Services,
    GlobalSecondaryIndexes: [
      {
        IndexName: DDB_INDEX_NAMES.SERVICES.AGENCY_ID_END_DATE,
        KeySchema: [
          { AttributeName: 'agency_id', KeyType: 'HASH' },
          { AttributeName: 'end_date', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
    ],
  },
];

// Set the env vars
setEnvVariablesFromTableConfig(tableConfigurations);

export default generateJestDynaliteConfig(tableConfigurations);
