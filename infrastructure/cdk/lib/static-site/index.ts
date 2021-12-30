import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import {
  Distribution,
  CachePolicy,
  ViewerProtocolPolicy,
} from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Bucket } from '@aws-cdk/aws-s3';
import { CfnOutput, RemovalPolicy } from '@aws-cdk/core';
import { Stack, StackProps, App } from '@serverless-stack/resources';
import { getDomainNameList, getSSLDomainName } from './helpers';

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

    const sslCertificate = new DnsValidatedCertificate(
      this,
      `${id}SSLCertificate`,
      {
        hostedZone,
        region: 'us-east-1',
        ...getSSLDomainName(rootDomainName, subdomains),
      }
    );

    // Create the bucket
    const bucket = new Bucket(this, 'StaticSiteBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Define the custom domain to use for the api
    const hostingDomainNames = getDomainNameList(rootDomainName, subdomains);
    const bucketOrigin = new S3Origin(bucket);
    const distribution = new Distribution(this, `${id}Distribution`, {
      defaultBehavior: {
        origin: bucketOrigin,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      additionalBehaviors: {
        // Don't cache the index.html
        'index.html': {
          origin: bucketOrigin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: CachePolicy.CACHING_DISABLED,
        },
      },
      domainNames: hostingDomainNames,
      certificate: sslCertificate,
      errorResponses: [
        // Forward any missing files to the index, so that it can be handled by
        // the react app instead
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

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
