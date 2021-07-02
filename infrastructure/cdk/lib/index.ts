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

  new TownsStack(app, 'module-town');
  new ShuttlesStack(app, 'module-shuttle');

  // Setup subdomains for each town in the system
  // TODO: Eventually, might move this into a Lambda function that adds a new
  // subdomain every time we create a new town in the database, or have a
  // script that polls DDB for the latest list before running this.
  // new StaticSiteStack(app, 'StaticAppPageStack', {
  //   rootDomainName,
  //   subdomains: ['fernie', 'revelstoke'],
  // });
}
