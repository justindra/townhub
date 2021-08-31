import { Construct } from '@aws-cdk/core';
import { AttributeType } from '@aws-cdk/aws-dynamodb';
import { DEFAULT_SECONDARY_INDEXES } from '@townhub-libs/constants';
import { TownhubTable, TownhubTableProps } from './table';

/**
 * A Table used in Townhub for all entities that belong to a specific module.
 * It adds default secondary indexes so that we can easily search by the townId
 * as well as the moduleId
 *
 * @output TableName
 * @output TableArn
 * @output TableStreamArn (optional)
 */
export class TownhubModuleTable extends TownhubTable {
  constructor(scope: Construct, id: string, props: TownhubTableProps = {}) {
    super(scope, id, props);

    // Add the secondary index so we can list by the town id
    this.ddbTable.addGlobalSecondaryIndex({
      indexName: DEFAULT_SECONDARY_INDEXES.BY_TOWN.name,
      partitionKey: {
        name: DEFAULT_SECONDARY_INDEXES.BY_TOWN.key,
        type: AttributeType.STRING,
      },
    });

    // Add the secondary index so we can list by the module id
    this.ddbTable.addGlobalSecondaryIndex({
      indexName: DEFAULT_SECONDARY_INDEXES.BY_MODULE.name,
      partitionKey: {
        name: DEFAULT_SECONDARY_INDEXES.BY_MODULE.key,
        type: AttributeType.STRING,
      },
    });
  }
}
