import { AnyAction } from 'redux';

export interface BaseAction extends AnyAction {
  type: string;
  townId: string;
  payload: any;
}