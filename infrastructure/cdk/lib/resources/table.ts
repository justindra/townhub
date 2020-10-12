import { CfnOutput, Construct } from '@aws-cdk/core';
import {
  Table,
  AttributeType,
  BillingMode,
  Attribute,
  TableProps,
} from '@aws-cdk/aws-dynamodb';

/**
 * A basic Table used in Townhub which incorporates certain defaults:
 *  - the partition key is always an `id` string
 *  - The billing mode is always pay per request
 */
export class TownhubTable extends Table {
  constructor(scope: Construct, id: string, props?: TableProps) {
    const DEFAULT_PARTITION_KEY: Attribute = {
      name: 'id',
      type: AttributeType.STRING,
    };
    const DEFAULT_BILLING_MODE: BillingMode = BillingMode.PAY_PER_REQUEST;
    super(scope, id, {
      partitionKey: DEFAULT_PARTITION_KEY,
      billingMode: DEFAULT_BILLING_MODE,
      ...(props ?? {}),
    });
  }
}

export interface TownhubTableOutputProps {
  table: Table;
  outputStream?: boolean;
}

/**
 * A set of Outputs for a Table:
 *  - TableName
 *  - TableArn
 *  - TableStreamArn (optional)
 */
export class TownhubTableOutput {
  constructor(
    scope: Construct,
    id: string,
    { table, outputStream }: TownhubTableOutputProps
  ) {
    new CfnOutput(scope, `${id}Name`, { value: table.tableName });
    new CfnOutput(scope, `${id}Arn`, { value: table.tableArn });
    if (outputStream) {
      new CfnOutput(scope, `${id}StreamArn`, {
        value: table.tableStreamArn ?? '',
      });
    }
  }
}
