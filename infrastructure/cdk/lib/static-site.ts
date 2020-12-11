import { Stack, StackProps, App } from '@serverless-stack/resources';
import { Duration } from '@aws-cdk/core';
import { S3Cloudfront } from './resources';

export interface StaticSiteStackProps extends StackProps {
  /** The root domain name, used to lookup a Route53 Hosted Zone */
  rootDomainName: string;
  /**
   * The subdomains to host the static site on, if different to the root domain
   * name. You can place multiple subdomains to point to the same bucket.
   */
  subdomains?: string[];
  excludeARecords?: boolean;
}

/**
 * A Stack that allows a static site to be hosted in an S3 Bucket. With
 * a CloudFront instance accessing it and Route53 record(s) pointing to the
 * instance.
 */
export default class StaticSiteStack extends Stack {
  constructor(
    scope: App,
    id: string,
    { rootDomainName, subdomains, excludeARecords, ...props }: StaticSiteStackProps
  ) {
    super(scope, id, props);

    new S3Cloudfront(this, 'StaticSite', {
      stage: scope.stage,
      rootDomainName,
      subdomains,
      behaviors: [
        { defaultTtl: Duration.seconds(0), pathPattern: 'index.html' },
        { isDefaultBehavior: true },
      ],
      errorConfigurations: [
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
      excludeARecords
    });
  }
}
