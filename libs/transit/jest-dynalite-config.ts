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
  {
    TableName: 'trips',
    KeySchema: [{ AttributeName: 'route_id_service_id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      {
        AttributeName: 'route_id_service_id',
        AttributeType: 'S',
      },
      {
        AttributeName: 'agency_id',
        AttributeType: 'S',
      },
      { AttributeName: 'service_id', AttributeType: 'S' },
    ],
    EnvVariableName: TransitDatabaseEnv.Trips,
    GlobalSecondaryIndexes: [
      {
        IndexName: DDB_INDEX_NAMES.TRIPS.AGENCY_ID_SERVICE_ID,
        KeySchema: [
          { AttributeName: 'agency_id', KeyType: 'HASH' },
          { AttributeName: 'service_id', KeyType: 'RANGE' },
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
