import { App, Stack, StackProps } from '@serverless-stack/resources';
import { TownhubTable } from '../resources';

/**
 * A Stack containing all the static infrastructure for the users feature
 * of Townhub.
 *
 * @output UsersTableName, UsersTableArn
 */
export class UsersStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the different tables for this module
    new TownhubTable(this, 'Users', { stage: scope.stage });
  }
}
