import { Stack, StackProps, App } from '@serverless-stack/resources';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CfnOutput } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from '@aws-cdk/aws-cloudfront';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { getCertificateArnFromContext, getDomainName } from './helpers';
// import { StringParameter } from '@aws-cdk/aws-ssm';

export interface StaticSiteStackProps extends StackProps {
  /** The root domain name, used to lookup a Route53 Hosted Zone */
  rootDomainName: string;
  /**
   * The subdomain to host the static site on, if different to
   * the root domain name.
   */
  subdomain?: string;
}

/**
 * A Stack that allows a static site to be hosted in an S3 Bucket. With
 * a CloudFront instance accessing it and a Route53 record pointing to the
 * instance.
 *
 */
export default class StaticSiteStack extends Stack {
  constructor(
    scope: App,
    id: string,
    { rootDomainName, subdomain, ...props }: StaticSiteStackProps
  ) {
    super(scope, id, props);

    // Define the custom domain to use for the api
    const hostingDomainName = getDomainName(
      scope.stage,
      rootDomainName,
      subdomain
    );

    // Find the hosted zone in Route53
    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: rootDomainName,
    });

    // Get the SSL Certificate ARN (see @townhub/infra-ssl for details)
    // Ideally the below should work, but it doesn't for some reason, issue has been logged
    // https://github.com/aws/aws-cdk/issues/10446
    // const sslCertificateArn = StringParameter.valueFromLookup(this, '/ssl-certs/global')
    const sslCertificateArn = getCertificateArnFromContext();

    // Create the bucket
    const bucket = new Bucket(this, 'StaticSiteBucket');

    // Create the CloudFront OAI
    const oai = new OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for ${hostingDomainName} bucket`,
    });

    // Create and attach the access policy to the bucket only allowing
    // the CloudFront OAI to access it.
    const policy = new PolicyStatement();
    policy.addActions('s3:GetBucket*');
    policy.addActions('s3:GetObject*');
    policy.addActions('s3:List*');
    policy.addResources(bucket.bucketArn, `${bucket.bucketArn}/$`);
    policy.addCanonicalUserPrincipal(
      oai.cloudFrontOriginAccessIdentityS3CanonicalUserId
    );

    bucket.addToResourcePolicy(policy);

    const distribution = new CloudFrontWebDistribution(
      this,
      'StaticSiteDistribution',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: oai,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        aliasConfiguration: {
          acmCertRef: sslCertificateArn,
          names: [hostingDomainName],
        },
      }
    );

    // Create a new A Record to point to the CloudFront Distribution
    new ARecord(this, 'ARecord', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      recordName: hostingDomainName,
    });

    // Output different values so it can be referenced by other stacks
    new CfnOutput(this, 'WebsiteDomainName', {
      value: hostingDomainName,
    });
    new CfnOutput(this, 'WebsiteBucketArn', {
      value: bucket.bucketArn,
    });
    new CfnOutput(this, 'CertificateArn', {
      value: sslCertificateArn,
    });
  }
}
