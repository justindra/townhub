import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import {
  Distribution,
  CachePolicy,
  ViewerProtocolPolicy,
} from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { CfnOutput, Construct, RemovalPolicy } from '@aws-cdk/core';
import { Bucket } from '@serverless-stack/resources';
import { getDomainNameList, getSSLDomainName } from './helpers';

export interface StaticSiteProps {
  /** The root domain name, used to lookup a Route53 Hosted Zone */
  rootDomainName: string;
  /**
   * The subdomains to host the static site on, if different to the root domain
   * name. You can place multiple subdomains to point to the same bucket.
   */
  subdomains?: string[];
}

/**
 * The StaticSite construct is a higher level CDK construct that makes it easy
 * to create a static website. It provides a simple way to build and deploy the
 * site to an S3 bucket; setup a CloudFront CDN for fast content delivery; and
 * configure a custom domain for the website URL.
 *
 * Similar to [SST StaticSite Construct](https://docs.serverless-stack.com/constructs/StaticSite).
 * the main difference being that this one does not deploy the static site on
 * deployment of the stack. Instead it exports the S3 Bucket URL which can be
 * used by another CI/CD system to push the deployment.
 */
export class StaticSite {
  constructor(
    scope: Construct,
    id: string,
    { rootDomainName, subdomains }: StaticSiteProps
  ) {
    // Find the hosted zone in Route53
    const hostedZone = HostedZone.fromLookup(scope, `${id}HostedZone`, {
      domainName: rootDomainName,
    });

    const sslCertificate = new DnsValidatedCertificate(
      scope,
      `${id}SSLCertificate`,
      {
        hostedZone,
        region: 'us-east-1',
        ...getSSLDomainName(rootDomainName, subdomains),
      }
    );

    const bucket = new Bucket(scope, `${id}Bucket`, {
      s3Bucket: {
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    });

    // Define the subdomains used to access the app
    const hostingDomainNames = getDomainNameList(rootDomainName, subdomains);

    const bucketOrigin = new S3Origin(bucket.s3Bucket);
    const distribution = new Distribution(scope, `${id}Distribution`, {
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
      new ARecord(scope, `${hostingDomainName}-ARecord`, {
        zone: hostedZone,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        recordName: hostingDomainName,
      });

      // Output different values so it can be referenced by other stacks
      new CfnOutput(scope, `${hostingDomainName}-Name`, {
        value: hostingDomainName,
      });
    });

    new CfnOutput(scope, `${id}BucketUrl`, {
      value: `s3://${bucket.bucketName}`,
    });
  }
}
