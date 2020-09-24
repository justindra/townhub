import { App } from '@serverless-stack/resources';
import { ParameterStack } from './parameter';

export default function main(app: App): void {
  new ParameterStack(app, 'SSLGlobalCertificateValue', {
    certificateArn: process.env.CERTIFICATE_ARN ?? '',
  });
}
