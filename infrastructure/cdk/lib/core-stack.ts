import { Stack, StackProps, App, Api } from '@serverless-stack/resources';
import { StaticSite, TownhubTable } from './resources';

export interface CoreStackProps extends StackProps {
  /** The root domain name, used to lookup a Route53 Hosted Zone */
  rootDomainName: string;
  /** The list of subdomains where the application can be accessed */
  appSubdomains: string[];
}

/**
 * A Stack that defines the core resources that should not change often and is
 * used by all services.
 */
export default class CoreStack extends Stack {
  /** The api endpoint to be used by other services adding new APIs */
  api: Api;

  constructor(
    scope: App,
    id: string,
    { rootDomainName, appSubdomains, ...props }: CoreStackProps
  ) {
    super(scope, id, props);

    /*************************************************************************
     * API Gateway for the backend
     *************************************************************************/
    const apiDomainName = `api.${rootDomainName}`;
    this.api = new Api(this, 'Api', {
      customDomain: {
        domainName: apiDomainName,
        hostedZone: rootDomainName,
      },
    });

    /*************************************************************************
     * Static site hosting for the frontend app
     *************************************************************************/
    new StaticSite(this, 'App', {
      rootDomainName,
      subdomains: appSubdomains,
    });

    /*************************************************************************
     * Towns Database
     *************************************************************************/
    new TownhubTable(this, 'Towns', { stage: scope.stage });

    /*************************************************************************
     * Transit Databases
     *************************************************************************/
  }
}
