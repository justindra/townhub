import { AttributeType } from '@aws-cdk/aws-dynamodb';
import { DEFAULT_SECONDARY_INDEXES } from '@townhub-libs/constants';
import { App, Stack, StackProps } from '@serverless-stack/resources';
import { TownhubTable } from '../resources/table';

/**
 * A Stack containing all the static infrastructure for the towns feature
 * of Townhub.
 *
 * @output TownsTableName, TownsTableArn
 * @output ModulesTableName, ModulesTableArn
 */
export default class TownsStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the different tables for this module
    const TownsTable = new TownhubTable(this, 'Towns', { stage: scope.stage });

    // Create an index by HID so we can easily find out if a HID exists or not
    // before creating a new one
    TownsTable.ddbTable.addGlobalSecondaryIndex({
      indexName: 'hid',
      partitionKey: { name: 'hid', type: AttributeType.STRING },
    });

    // The modules table
    const ModulesTable = new TownhubTable(this, 'Modules', {
      stage: scope.stage,
    });

    ModulesTable.ddbTable.addGlobalSecondaryIndex({
      indexName: DEFAULT_SECONDARY_INDEXES.BY_TOWN.name,
      partitionKey: {
        name: DEFAULT_SECONDARY_INDEXES.BY_TOWN.key,
        type: AttributeType.STRING,
      },
      // Sort by the Module Type
      sortKey: { name: 'type', type: AttributeType.STRING },
    });
  }
}
