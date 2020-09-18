import { App } from '@serverless-stack/resources';
import ApiGatewayStack from './api-gateway';

export default function main(app: App): void {
  new ApiGatewayStack(app, 'ApiGatewayStack', {
    rootDomainName: 'townhub.ca',
  });
}
