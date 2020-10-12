import { App, Stack, StackProps } from '@serverless-stack/resources';
import { TownhubTableOutput, TownhubTable } from '../resources/table';

/**
 * A Stack containing all the static infrastructure for the shuttle feature
 * of Townhub.
 *
 * @output StopsTableName, StopsTableArn
 * @output RoutesTableName, RoutesTableArn
 * @output SchedulesTableName, SchedulesTableArn
 * @output DailySchedulesTableName, DailySchedulesTableArn
 */
export default class ShuttleStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const StopsTable = new TownhubTable(this, 'Stops');
    const RoutesTable = new TownhubTable(this, 'Routes');
    const SchedulesTable = new TownhubTable(this, 'Schedules');
    const DailySchedulesTable = new TownhubTable(this, 'DailySchedules');

    // Output different values so it can be referenced by other stacks
    new TownhubTableOutput(this, 'StopsTable', { table: StopsTable });
    new TownhubTableOutput(this, 'RoutesTable', { table: RoutesTable });
    new TownhubTableOutput(this, 'SchedulesTable', { table: SchedulesTable });
    new TownhubTableOutput(this, 'DailySchedulesTable', {
      table: DailySchedulesTable,
    });
  }
}
