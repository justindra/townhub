import { Stack, StackProps, App } from '@serverless-stack/resources';
import { RestApi } from '@aws-cdk/aws-apigateway';
import {
  Certificate,
  CertificateValidation,
} from '@aws-cdk/aws-certificatemanager';
import { HostedZone, ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { ApiGateway as ApiGatewayTarget } from '@aws-cdk/aws-route53-targets';
import { CfnOutput } from '@aws-cdk/core';
import { StringParameter } from '@aws-cdk/aws-ssm';

export interface ApiGatewayStackProps extends StackProps {
  /** The root domain name, used to lookup a Route53 Hosted Zone */
  rootDomainName: string;
}

/**
 * A Stack that defines an API Gateway Rest Endpoint for a custom domain.
 * It should create it on the endpoint `api.[domainName]` for production or
 * `api.[stage].[domainName]` for other stages.
 *
 * @output ApiGatewayRestApiId
 * @output ApiGatewayRestApiRootResourceId
 * @output ApiDomainName
 */
export default class ApiGatewayStack extends Stack {
  constructor(
    scope: App,
    id: string,
    { rootDomainName, ...props }: ApiGatewayStackProps
  ) {
    super(scope, id, props);

    // Define the custom domain to use for the api
    const apiDomainName =
      scope.stage === 'prod'
        ? `api.${rootDomainName}`
        : `api.${scope.stage}.${rootDomainName}`;

    // Find the hosted zone in Route53
    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: rootDomainName,
    });

    // Create a new SSL Certificate for the Api Domain
    const sslCertificate = new Certificate(this, 'sslCertificate', {
      domainName: apiDomainName,
      validation: CertificateValidation.fromDns(hostedZone),
    });

    // Create the REST-API endpoint
    const api = new RestApi(this, 'ApiGateway', {
      restApiName: `${scope.name}-${scope.stage}-ApiGateway`,
      description: `The main API Gateway for ${scope.name}`,
      domainName: {
        domainName: apiDomainName,
        certificate: sslCertificate,
      },
    });

    // An endpoint must have a default method at the root
    api.root.addMethod('ANY');

    // Create a new A Record to point to the API Gateway
    new ARecord(this, 'ARecord', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new ApiGatewayTarget(api)),
      recordName: apiDomainName,
    });

    // Output the different values into SSM as an alternative to CFN Outputs
    new StringParameter(this, 'ApiGatewayRestApiId', {
      parameterName: `/townhub/${scope.stage}/api-gateway/rest-api-id`,
      stringValue: api.restApiId,
    });
    new StringParameter(this, 'ApiGatewayRestApiRootResourceId', {
      parameterName: `/townhub/${scope.stage}/api-gateway/rest-api-root-resource-id`,
      stringValue: api.restApiRootResourceId,
    });
    new StringParameter(this, 'ApiDomainName', {
      parameterName: `/townhub/${scope.stage}/api-gateway/domain-name`,
      stringValue: apiDomainName,
    });

    // Output different values so it can be referenced by other stacks
    new CfnOutput(this, 'ApiGatewayRestApiId', {
      value: api.restApiId,
    });
    new CfnOutput(this, 'ApiGatewayRestApiRootResourceId', {
      value: api.restApiRootResourceId,
    });
    new CfnOutput(this, 'ApiDomainName', {
      value: apiDomainName,
    });
  }
}
