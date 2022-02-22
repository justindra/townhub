import {
  App,
  Function,
  RDS,
  Stack,
  StackProps,
} from '@serverless-stack/resources';
import { RemovalPolicy } from 'aws-cdk-lib';

const DATABASE_NAME = 'TownhubDatabase';
export class StaticStack extends Stack {
  constructor(scope: App, props?: StackProps) {
    super(scope, 'StaticStack', props);

    const cluster = new RDS(this, 'AuroraCluster', {
      engine: 'postgresql10.14',
      defaultDatabaseName: DATABASE_NAME,
      rdsServerlessCluster: {
        removalPolicy:
          scope.stage === 'prod'
            ? RemovalPolicy.SNAPSHOT
            : RemovalPolicy.DESTROY,
      },
      migrations: 'stacks/migrations/dist',
    });

    new Function(this, 'TestFunction', {
      handler: 'services/sample/index.handler',
      environment: {
        DATABASE_NAME,
        DATABASE_CLUSTER_ARN: cluster.clusterArn,
        DATABASE_SECRET_ARN: cluster.secretArn,
      },
      permissions: [cluster],
    });
  }
}
