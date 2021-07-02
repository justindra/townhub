import {
  DnsValidatedCertificate,
  CertificateValidation,
} from '@aws-cdk/aws-certificatemanager';
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from '@aws-cdk/aws-cloudfront';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Bucket } from '@aws-cdk/aws-s3';
import { CfnOutput, Duration, RemovalPolicy } from '@aws-cdk/core';
import { Stack, StackProps, App } from '@serverless-stack/resources';
import { getDomainNameList } from './helpers';

export interface StaticSiteStackProps extends StackProps {
  /** The root domain name, used to lookup a Route53 Hosted Zone */
  rootDomainName: string;
  /**
   * The subdomains to host the static site on, if different to the root domain
   * name. You can place multiple subdomains to point to the same bucket.
   */
  subdomains?: string[];
}

/**
 * A Stack that allows a static site to be hosted in an S3 Bucket. With
 * a CloudFront instance accessing it and Route53 record(s) pointing to the
 * instance.
 *
 */
export default class StaticSiteStack extends Stack {
  constructor(
    scope: App,
    id: string,
    { rootDomainName, subdomains, ...props }: StaticSiteStackProps
  ) {
    super(scope, id, props);

    // Find the hosted zone in Route53
    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: rootDomainName,
    });

    // Define the custom domain to use for the api
    const hostingDomainNames = getDomainNameList(
      scope.stage,
      rootDomainName,
      subdomains
    );

    // Create a new SSL Certificate for the Api Domain
    const sslCertificate = new DnsValidatedCertificate(this, 'sslCertificate', {
      domainName: rootDomainName,
      hostedZone,
      region: 'us-east-1',
      validation: CertificateValidation.fromDns(hostedZone),
      subjectAlternativeNames: hostingDomainNames,
    });

    // Create the bucket
    const bucket = new Bucket(this, 'StaticSiteBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create the CloudFront OAI
    const oai = new OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for ${scope.name} bucket`,
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
            behaviors: [
              { defaultTtl: Duration.seconds(0), pathPattern: 'index.html' },
              { isDefaultBehavior: true },
            ],
          },
        ],
        // Re-direct all 404s to the index.html to allow for SPA routing
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
        aliasConfiguration: {
          acmCertRef: sslCertificate.certificateArn,
          names: hostingDomainNames,
        },
      }
    );

    // Go through each given domain names and set the policies and domain
    // names for each required hosting domain names
    hostingDomainNames.forEach((hostingDomainName) => {
      // Create a new A Record to point to the CloudFront Distribution
      new ARecord(this, `${hostingDomainName}-ARecord`, {
        zone: hostedZone,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        recordName: hostingDomainName,
      });

      // Output different values so it can be referenced by other stacks
      new CfnOutput(this, `${hostingDomainName}-Name`, {
        value: hostingDomainName,
      });
    });

    new CfnOutput(this, 'WebsiteBucketArn', {
      value: bucket.bucketArn,
    });
  }
}
