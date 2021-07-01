import { CfnOutput, Construct, RemovalPolicy } from '@aws-cdk/core';
import {
  Table,
  AttributeType,
  BillingMode,
  Attribute,
  TableProps,
  StreamViewType,
} from '@aws-cdk/aws-dynamodb';

export interface TownhubTableProps {
  /** Any props to pass into the table */
  tableProps?: TableProps;
  /** Whether or not to create a stream */
  outputStream?: boolean;
  /** The stage passed in from the top */
  stage?: string;
}

/**
 * A basic Table used in Townhub which incorporates certain defaults:
 *  - the partition key is always an `id` string
 *  - The billing mode is always pay per request
 *
 * @output TableName
 * @output TableArn
 * @output TableStreamArn (optional)
 */
export class TownhubTable {
  ddbTable: Table;

  constructor(
    scope: Construct,
    id: string,
    { outputStream, tableProps, stage }: TownhubTableProps = {}
  ) {
    const DEFAULT_PARTITION_KEY: Attribute = {
      name: 'id',
      type: AttributeType.STRING,
    };
    const DEFAULT_BILLING_MODE: BillingMode = BillingMode.PAY_PER_REQUEST;

    // Create the table
    this.ddbTable = new Table(scope, id, {
      partitionKey: DEFAULT_PARTITION_KEY,
      billingMode: DEFAULT_BILLING_MODE,
      // Retain on prod, otherwise destroy
      removalPolicy:
        stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      // Set the streamViewType to show both by default
      ...(outputStream ? { stream: StreamViewType.NEW_IMAGE } : {}),
      ...(tableProps ?? {}),
    });

    // Cloudformation Outputs
    new CfnOutput(scope, `${id}TableName`, { value: this.ddbTable.tableName });
    new CfnOutput(scope, `${id}TableArn`, { value: this.ddbTable.tableArn });
    if (outputStream) {
      new CfnOutput(scope, `${id}TableStreamArn`, {
        value: this.ddbTable.tableStreamArn ?? '',
      });
    }
  }
}
