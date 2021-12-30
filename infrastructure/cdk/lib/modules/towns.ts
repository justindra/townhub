import { App, Stack, TableFieldType } from '@serverless-stack/resources';
import { TOWNS_DATABASE } from '@townhub-libs/towns';
import { TownhubTable } from '../resources';
import { ServiceStackProps } from './base';

interface TownsServiceProps extends ServiceStackProps {}

/**
 * A Stack containing all the static infrastructure for the towns feature
 * of Townhub.
 */
export class TownsStack extends Stack {
  constructor(scope: App, id: string, { api, ...props }: TownsServiceProps) {
    super(scope, id, props);

    /*************************************************************************
     * Databases
     *************************************************************************/
    const TownsTable = new TownhubTable(this, `${id}TownsTable`, {
      stage: scope.stage,
      fields: { hid: TableFieldType.STRING },
      primaryIndex: { partitionKey: 'hid' },
    });

    /*************************************************************************
     * API Endpoints
     *************************************************************************/
    api.addRoutes(this, {
      'GET /towns/hid/{townHid}': {
        function: {
          srcPath: 'src/towns/',
          handler: 'get-by-hid.main',
          environment: { [TOWNS_DATABASE.ENV]: TownsTable.tableName },
          permissions: [TownsTable],
        },
      },
    });
  }
}
