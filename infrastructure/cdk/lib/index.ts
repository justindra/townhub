import MyStack from './MyStack';
import { App } from '@serverless-stack/resources';
import ApiGatewayStack from './api-gateway';

export default function main(app: App): void {
  new MyStack(app, 'my-stack');

  new ApiGatewayStack(app, 'ApiGatewayStack', undefined, 'townhub.ca');
}
