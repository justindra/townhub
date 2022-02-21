import { App, Function, Stack, StackProps } from '@serverless-stack/resources';

export class StaticStack extends Stack {
  constructor(scope: App, props?: StackProps) {
    super(scope, 'StaticStack', props);

    new Function(this, 'TestFunction', {
      handler: 'services/sample/index.handler',
    });
  }
}
