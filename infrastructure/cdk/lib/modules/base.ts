import { Api, StackProps } from '@serverless-stack/resources';
import { TownhubTable } from '../resources';

export interface ServiceStackProps extends StackProps {
  api: Api;
  tables: {
    townsTable: TownhubTable;
  };
}
