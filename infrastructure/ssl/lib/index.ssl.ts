import { App } from '@serverless-stack/resources';
import { SslCertificateStack } from './ssl-certificate';

export default function main(app: App): void {
  new SslCertificateStack(app, 'SSLGlobalCertificateSource', {
    rootDomainName: 'townhub.ca',
  });
}
