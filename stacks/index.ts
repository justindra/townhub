import { App } from '@serverless-stack/resources';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { StaticStack } from './static';

export default function main(app: App): void {
  app.setDefaultFunctionProps({
    srcPath: 'backend',
    runtime: Runtime.NODEJS_14_X,
  });

  new StaticStack(app);
}
