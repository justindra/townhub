import { App, Stack } from '@serverless-stack/resources';
import { ServiceStackProps } from './base';

interface TownsServiceProps extends ServiceStackProps {}

/**
 * A Stack containing all the static infrastructure for the towns feature
 * of Townhub.
 */
export default class TownsStack extends Stack {
  constructor(scope: App, id: string, { api, ...props }: TownsServiceProps) {
    super(scope, id, props);

    api.addRoutes(this, {
      'GET /towns/hid/{townHid}': 'src/towns/get-by-hid.main',
    });
  }
}
