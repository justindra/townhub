import { App, Stack, StackProps } from '@serverless-stack/resources';
import { TownhubTable } from '../resources';

/**
 * A Stack containing all the static infrastructure for the vendors feature
 * of Townhub.
 *
 * @output VendorsTableName, VendorsTableArn
 */
export class VendorsStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the different tables for this module
    new TownhubTable(this, 'Vendors', { stage: scope.stage });
  }
}
