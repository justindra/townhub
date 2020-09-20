import { App } from '@serverless-stack/resources';
// import ApiGatewayStack from './api-gateway';
import StaticSiteStack from './static-site';

export default function main(app: App): void {
  // new ApiGatewayStack(app, 'ApiGatewayStack', {
  //   rootDomainName: 'townhub.ca',
  // });

  new StaticSiteStack(app, 'StaticHomePageStack', {
    rootDomainName: 'townhub.ca',
    sslCertificateArn: 'b.certificateArn',
  });
}
