import { App, Stack, StackProps } from '@serverless-stack/resources';
import { CfnOutput } from '@aws-cdk/core';

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

    new CfnOutput(this, 'SSLGlobalCertificate', {
      value: certificateArn,
      exportName: 'SSLGlobalCertificate',
    });
  }
}
