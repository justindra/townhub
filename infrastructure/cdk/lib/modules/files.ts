import { App, Stack, StackProps } from '@serverless-stack/resources';
import { S3Cloudfront, TownhubTable } from '../resources';
import { RemovalPolicy } from '@aws-cdk/core';

export interface FilesStackProps extends StackProps {
  rootDomainName: string;
  subdomains: string[];
}

/**
 * A Stack containing all the static infrastructure for the files feature
 * of Townhub.
 *
 * @output FilesTableName, FilesTableArn
 * @output FilesBucketArn
 * @output ${subdomain}Name
 */
export class FilesStack extends Stack {
  constructor(
    scope: App,
    id: string,
    { rootDomainName, subdomains, ...props }: FilesStackProps
  ) {
    super(scope, id, props);

    // Create the different tables for this module
    new TownhubTable(this, 'Files', { stage: scope.stage });

    // Create the files bucket for
    new S3Cloudfront(this, 'Files', {
      stage: scope.stage,
      rootDomainName,
      subdomains,
      removalPolicy:
        scope.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });
  }
}
