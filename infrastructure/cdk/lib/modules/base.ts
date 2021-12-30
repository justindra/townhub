import { Api, StackProps } from '@serverless-stack/resources';

export interface ServiceStackProps extends StackProps {
  api: Api;
}
