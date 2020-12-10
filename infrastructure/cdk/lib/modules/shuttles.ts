import { App, Stack, StackProps } from '@serverless-stack/resources';
import { TownhubTable } from '../resources/table';

/**
 * A Stack containing all the static infrastructure for the shuttle feature
 * of Townhub.
 *
 * @output StopsTableName, StopsTableArn
 * @output RoutesTableName, RoutesTableArn
 * @output SchedulesTableName, SchedulesTableArn
 * @output DailySchedulesTableName, DailySchedulesTableArn
 */
export class ShuttlesStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the different tables for this module
    new TownhubTable(this, 'Stops', { stage: scope.stage });
    new TownhubTable(this, 'Routes', { stage: scope.stage });
    new TownhubTable(this, 'Schedules', { stage: scope.stage });
    new TownhubTable(this, 'DailySchedules', { stage: scope.stage });
  }
}
