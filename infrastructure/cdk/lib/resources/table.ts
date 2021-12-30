import { Construct, RemovalPolicy } from '@aws-cdk/core';
import {
  Table as SSTTable,
  TableProps as SSTTableProps,
} from '@serverless-stack/resources';

interface TownhubTableProps extends SSTTableProps {
  stage: string;
}

/**
 * A basic Table used in Townhub which incorporates certain defaults:
 *  - The billing mode is always pay per request (done by SST Table)
 *  - PIT is enabled in prod
 *  - The removal policy is retain in prod and destroy in other env
 *
 * @output TableName
 * @output TableArn
 * @output TableStreamArn (optional)
 */
export class TownhubTable extends SSTTable {
  constructor(
    scope: Construct,
    id: string,
    { stage, ...props }: TownhubTableProps
  ) {
    super(scope, id, {
      ...props,
      dynamodbTable: {
        // In prod, we enable PIT
        pointInTimeRecovery: stage === 'prod',
        // In prod, we retain otherwise, we just remove it
        removalPolicy:
          stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      },
    });
  }
}
