import { App, Stack, StackProps } from '@serverless-stack/resources';
import { TownhubModuleTable } from '../resources/module-table';

/**
 * A Stack containing all the static infrastructure for the shuttle feature
 * of Townhub.
 *
 * @output StopsTableName, StopsTableArn
 * @output RoutesTableName, RoutesTableArn
 * @output SchedulesTableName, SchedulesTableArn
 * @output DailySchedulesTableName, DailySchedulesTableArn
 */
export default class ShuttlesStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the different tables for this module
    new TownhubModuleTable(this, 'Stops', { stage: scope.stage });
    new TownhubModuleTable(this, 'Routes', { stage: scope.stage });
    new TownhubModuleTable(this, 'Schedules', { stage: scope.stage });
    new TownhubModuleTable(this, 'DailySchedules', { stage: scope.stage });
  }
}
