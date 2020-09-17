import MyStack from './MyStack';
import { App } from '@serverless-stack/resources';

export default function main(app: App): void {
  new MyStack(app, 'my-stack');

  // Add more stacks

  // API Gateway Stack
  // - ApiGateway
  // - Route53 Alias to it
  // - Add first Serverless service with an ApiGateway defined in the CDK
  // - End result should have https://api.townhub.ca/test
}
