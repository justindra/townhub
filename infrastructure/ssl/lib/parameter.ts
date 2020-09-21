import { App, Stack, StackProps } from '@serverless-stack/resources';
import { StringParameter } from '@aws-cdk/aws-ssm';

export type ParameterStackProps = StackProps & {
  certificateArn: string;
};

/**
 * A stack that just outputs the provided CertificateARN. This is to handle the
 * fact that CloudFront requires a certificate in the `us-east-1` region.
 */
export class ParameterStack extends Stack {
  public certificateArn: string;
  constructor(
    scope: App,
    id: string,
    { certificateArn, ...props }: ParameterStackProps
  ) {
    super(scope, id, props);

    // We use a string parameter here instead of a Cfn Output to make it easier
    // if we ever need to update the value
    new StringParameter(this, 'SSLGlobalCertificateParameter', {
      stringValue: certificateArn,
      parameterName: '/ssl-certs/global',
    });
  }
}
