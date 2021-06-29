import { AttributeType } from '@aws-cdk/aws-dynamodb';
import { App, Stack, StackProps } from '@serverless-stack/resources';
import { TownhubTable } from '../resources/table';
import { DEFAULT_SECONDARY_INDEXES } from '../../src/constants';

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
    new TownhubTable(this, 'Towns', { stage: scope.stage });

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
    });
  }
}
