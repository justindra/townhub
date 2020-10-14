import { App } from '@serverless-stack/resources';
import ApiGatewayStack from './api-gateway';
import StaticSiteStack from './static-site';
import ShuttlesStack from './modules/shuttles';
import TownsStack from './modules/towns';

export default function main(app: App): void {
  const rootDomainName = 'townhub.ca';

  new ApiGatewayStack(app, 'ApiGatewayStack', {
    rootDomainName,
  });

  new StaticSiteStack(app, 'StaticHomePageStack', {
    rootDomainName,
  });

  new ShuttlesStack(app, 'module-shuttle');
  new TownsStack(app, 'module-town');
}
