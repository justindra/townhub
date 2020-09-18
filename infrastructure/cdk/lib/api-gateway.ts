import { Stack, StackProps, App } from '@serverless-stack/resources';
import { RestApi } from '@aws-cdk/aws-apigateway';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
// API Gateway Stack
// - ApiGateway
// - Route53 Alias to it
// - Add first Serverless service with an ApiGateway defined in the CDK
// - Create a sub-domain based on the environment, unless prod, then stick to the root domain
// - End result should have https://api.townhub.ca/test or https://api.dev.townhub.ca/test

export default class ApiGatewayStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const apiDomainName =
      scope.stage === 'prod'
        ? 'api.townhub.ca'
        : `api.${scope.stage}.townhub.ca`;

    const sslCertificateArn = StringParameter.fromStringParameterAttributes(
      this,
      'sslCertificateArn',
      {
        parameterName: `/ssl-certificate/townhub-arn/${scope.region}`,
      }
    );

    // Instead of from ARN, we need to create a new certificate in our hosted zone.
    // https://docs.aws.amazon.com/cdk/api/latest/docs/aws-certificatemanager-readme.html#dns-validation

    const sslCertificate = Certificate.fromCertificateArn(
      this,
      'sslCertificate',
      sslCertificateArn.stringValue
    );

    const api = new RestApi(this, 'ApiGateway', {
      restApiName: `${scope.name}-${scope.stage}-ApiGateway`,
      description: `The main API Gateway for ${scope.name}`,
      domainName: {
        domainName: apiDomainName,
        certificate: sslCertificate,
      },
    });

    api.root.addMethod('ANY');
  }
}
