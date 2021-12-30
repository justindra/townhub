import { App } from '@serverless-stack/resources';
import ShuttlesStack from './modules/shuttles';
import TownsStack from './modules/towns';
import CoreStack from './core-stack';

export default function main(app: App): void {
  const rootDomainName =
    app.stage === 'prod' ? 'townhub.ca' : `${app.stage}.townhub.ca`;

  const core = new CoreStack(app, 'TownhubCore', {
    rootDomainName,
    // Setup subdomains for each town in the system
    // TODO: Eventually, might move this into a Lambda function that adds a new
    // subdomain every time we create a new town in the database, or have a
    // script that polls DDB for the latest list before running this.
    appSubdomains: ['fernie', 'revelstoke'],
  });

  // new StaticSiteStack(app, 'StaticHomePageStack', {
  //   rootDomainName,
  // });

  // new ShuttlesStack(app, 'module-shuttle');
  // new TownsStack(app, 'module-town');
}
