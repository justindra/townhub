import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CfnOutput, Construct, RemovalPolicy } from '@aws-cdk/core';
import { Bucket, RoutingRule } from '@aws-cdk/aws-s3';
import {
  Behavior,
  CfnDistribution,
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from '@aws-cdk/aws-cloudfront';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { getDomainNameList } from './helpers';
import { StringParameter } from '@aws-cdk/aws-ssm';

export interface S3CloudfrontProps {
  /** The stage for the environment */
  stage: string;
  /** The root domain name, used to lookup a Route53 Hosted Zone */
  rootDomainName: string;
  /**
   * The subdomains to host the files on, if different to the root domain
   * name. You can place multiple subdomains to point to the same bucket.
   */
  subdomains?: string[];
  /** The bucket's removal policy */
  removalPolicy?: RemovalPolicy;
  /**
   * Set of behaviours for Cloudfront to use. At least one (default) behavior
   * must be included.
   */
  behaviors?: Behavior[];
  /**
   * How CloudFront should handle requests that are not successful
   * (eg PageNotFound)
   *
   * By default, CloudFront does not replace HTTP status codes in the 4xx and
   * 5xx range with custom error messages. CloudFront does not cache HTTP
   * status codes.
   */
  errorConfigurations?: CfnDistribution.CustomErrorResponseProperty[];
  /**
   * Exclude the generation of A Records. Added this in so I can just toggle
   * a flag when CloudFormation whinges about A Records that already exists
   * instead of just updating them.
   */
  excludeARecords?: boolean;
}

/**
 * A resource for static file hosting with a Cloudfront instance as a CDN and
 * Route53 record(s) pointing to the instance.
 */
export class S3Cloudfront {
  constructor(
    scope: Construct,
    id: string,
    {
      stage,
      rootDomainName,
      subdomains,
      removalPolicy = RemovalPolicy.DESTROY,
      behaviors = [{ isDefaultBehavior: true }],
      errorConfigurations,
      excludeARecords = false,
    }: S3CloudfrontProps
  ) {
    // Find the hosted zone in Route53
    const hostedZone = HostedZone.fromLookup(scope, 'RootHostedZone', {
      domainName: rootDomainName,
    });

    // Get the SSL Certificate ARN (see @townhub/infra-ssl for details)
    // StringParameter.valueFromLookup seems to add a newline character at the end,
    // so we should remove it before using.
    // https://github.com/aws/aws-cdk/issues/10446
    const sslCertificateArn = StringParameter.valueFromLookup(
      scope,
      '/ssl-certs/global'
    ).replace(/\r?\n|\r/g, '');

    // Create the bucket
    const bucket = new Bucket(scope, `${id}Bucket`, { removalPolicy });

    // Define the custom domain to use for the api
    const hostingDomainNames = getDomainNameList(
      stage,
      rootDomainName,
      subdomains
    );

    // Create the CloudFront OAI
    const oai = new OriginAccessIdentity(scope, `${id}OAI`, {
      comment: `OAI for ${id}Bucket`,
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
      scope,
      `${id}Distribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: oai,
            },
            behaviors,
          },
        ],
        errorConfigurations,
        aliasConfiguration: {
          acmCertRef: sslCertificateArn,
          names: hostingDomainNames,
        },
      }
    );

    if (!excludeARecords) {
      // Go through each given domain names and set the policies and domain
      // names for each required hosting domain names
      hostingDomainNames.forEach((hostingDomainName) => {
        // Create a new A Record to point to the CloudFront Distribution
        new ARecord(scope, `${hostingDomainName}ARecord`, {
          zone: hostedZone,
          target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
          recordName: hostingDomainName,
        });

        // Output different values so it can be referenced by other stacks
        new CfnOutput(scope, `${hostingDomainName}Name`, {
          value: hostingDomainName,
        });
      });
    }

    new CfnOutput(scope, `${id}BucketArn`, {
      value: bucket.bucketArn,
    });

    new CfnOutput(scope, `${id}BucketName`, {
      value: bucket.bucketName,
    });

    return { bucket };
  }
}
