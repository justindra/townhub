import { App, Stack, StackProps } from '@serverless-stack/resources';
import { TownhubTable } from '../resources/table';

/**
 * A Stack containing all the static infrastructure for the towns feature
 * of Townhub.
 *
 * @output TownsTableName, TownsTableArn
 */
export default class TownsStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the different tables for this module
    new TownhubTable(this, 'Towns', { stage: scope.stage });
  }
}
