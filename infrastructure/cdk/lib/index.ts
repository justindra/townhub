import { App } from '@serverless-stack/resources';
import ApiGatewayStack from './api-gateway';
import StaticSiteStack from './static-site';
import { FilesStack, ShuttlesStack, TownsStack, VendorsStack } from './modules';

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
  new VendorsStack(app, 'module-vendor');
  new FilesStack(app, 'module-file', {
    rootDomainName,
    subdomains: ['files'],
  });

  // Setup subdomains for each town in the system
  // TODO: Eventually, might move this into a Lambda function that adds a new
  // subdomain every time we create a new town in the database, or have a
  // script that polls DDB for the latest list before running this.
  new StaticSiteStack(app, 'StaticAppPageStack', {
    rootDomainName,
    subdomains: ['fernie', 'revelstoke'],
  });
}
