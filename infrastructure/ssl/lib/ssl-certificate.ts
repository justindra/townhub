import { App, Stack, StackProps } from '@serverless-stack/resources';
import { HostedZone } from '@aws-cdk/aws-route53';
import {
  Certificate,
  CertificateValidation,
} from '@aws-cdk/aws-certificatemanager';
import { CfnOutput } from '@aws-cdk/core';

export type SslCertificateStackProps = StackProps & {
  rootDomainName: string;
};

/**
 * A stack that generates an SSL Certificate. This is mainly needed as
 * Cloudfront requires the Certificate to exist in the `us-east-1` region.
 */
export class SslCertificateStack extends Stack {
  public certificateArn: string;
  constructor(
    scope: App,
    id: string,
    { rootDomainName, ...props }: SslCertificateStackProps
  ) {
    super(scope, id, props);

    // Find the hosted zone in Route53
    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: rootDomainName,
    });

    // Create a new SSL Certificate for the Api Domain
    const sslCertificate = new Certificate(this, 'sslCertificate', {
      domainName: rootDomainName,
      subjectAlternativeNames: [`*.${rootDomainName}`],
      validation: CertificateValidation.fromDns(hostedZone),
    });

    new CfnOutput(this, 'SSLGlobalCertificate', {
      value: sslCertificate.certificateArn,
      exportName: 'SSLGlobalCertificate',
    });
  }
}
