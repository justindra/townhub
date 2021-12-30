import { Stack, StackProps, App, Api } from '@serverless-stack/resources';

export interface ApiGatewayStackProps extends StackProps {
  /** The root domain name, used to lookup a Route53 Hosted Zone */
  rootDomainName: string;
}

/**
 * A Stack that defines an API Gateway Rest Endpoint for a custom domain.
 * It should create it on the endpoint `api.[rootDomainName]`.
 */
export default class ApiGatewayStack extends Stack {
  api: Api;

  constructor(
    scope: App,
    id: string,
    { rootDomainName, ...props }: ApiGatewayStackProps
  ) {
    super(scope, id, props);

    // Define the custom domain to use for the api
    const apiDomainName = `api.${rootDomainName}`;

    this.api = new Api(this, 'Api', {
      customDomain: apiDomainName,
    });
  }
}
