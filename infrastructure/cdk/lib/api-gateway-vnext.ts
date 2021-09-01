import { HttpLambdaAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers';
import { HostedZone } from '@aws-cdk/aws-route53';
import { StringParameter } from '@aws-cdk/aws-ssm';
import {
  Stack,
  App,
  Api,
  ApiAuthorizationType,
  Function,
} from '@serverless-stack/resources';

export interface ApiGatewayStackProps {
  /** The root domain name, used to lookup a Route53 Hosted Zone */
  rootDomainName: string;
}

/**
 * A Stack that defines an API Gateway Rest Endpoint for a custom domain.
 * It should create it on the endpoint `api.[domainName]` for production or
 * `api.[stage].[domainName]` for other stages.
 */
export default class ApiGatewayVNextStack extends Stack {
  public readonly api: Api;

  constructor(
    scope: App,
    id: string,
    { rootDomainName }: ApiGatewayStackProps
  ) {
    super(scope, id, {});

    // Define the custom domain to use for the api
    const apiDomainName =
      scope.stage === 'prod'
        ? `api-vnext.${rootDomainName}`
        : `api-vnext.${scope.stage}.${rootDomainName}`;

    // Find the hosted zone in Route53
    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: rootDomainName,
    });

    this.api = new Api(this, 'api', {
      customDomain: {
        domainName: apiDomainName,
        hostedZone,
      },
      // Default to Custom Authorizer to authorizer with Auth0
      defaultAuthorizationType: ApiAuthorizationType.CUSTOM,
      defaultAuthorizer: new HttpLambdaAuthorizer({
        authorizerName: 'LambdaAuthorizer',
        handler: new Function(this, 'Authorizer', {
          handler: 'src/authorizer/index.main',
          environment: {
            AUTH0_JWKS_URI: StringParameter.valueForStringParameter(
              this,
              `/townhub/${scope.stage}/auth0/jwks-uri`
            ),
            AUTH0_AUDIENCE: StringParameter.valueForStringParameter(
              this,
              `/townhub/${scope.stage}/auth0/audience`
            ),
            AUTH0_ISSUER: StringParameter.valueForStringParameter(
              this,
              `/townhub/${scope.stage}/auth0/issuer`
            ),
          },
        }),
      }),
      httpApi: { description: `API Gateway for ${apiDomainName}` },
    });

    // Show the API endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.customDomainUrl || this.api.url,
    });
  }
}
