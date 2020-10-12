import { App } from '@serverless-stack/resources';
import ApiGatewayStack from './api-gateway';
import StaticSiteStack from './static-site';
import ShuttleStack from './features/shuttle';

export default function main(app: App): void {
  const rootDomainName = 'townhub.ca';

  new ApiGatewayStack(app, 'ApiGatewayStack', {
    rootDomainName,
  });

  new StaticSiteStack(app, 'StaticHomePageStack', {
    rootDomainName,
  });

  new ShuttleStack(app, 'FeatureShuttleStack');
}
