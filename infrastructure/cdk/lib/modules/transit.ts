import { App, Stack } from '@serverless-stack/resources';
import { ServiceStackProps } from './base';

interface TransitServiceProps extends ServiceStackProps {}

/**
 * A Stack containing all the static infrastructure for the transit feature
 * of Townhub.
 */
export default class TransitStack extends Stack {
  constructor(scope: App, id: string, { api, ...props }: TransitServiceProps) {
    super(scope, id, props);

    api.addRoutes(this, {
      'GET /transit/daily/{timestamp}': 'src/handler.main',
    });
  }
}
