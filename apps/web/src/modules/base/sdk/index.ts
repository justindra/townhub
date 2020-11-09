import { AnyAction } from 'redux';

export interface BaseEffect<TModule extends string = string, TItem extends object = {}> {
  /** The module we are targetting */
  module: TModule;
  method: string;
  params: TItem;
}

export interface BaseAction<TPayload = any> extends AnyAction {
  type: string;
  townId: string;
  payload: TPayload;
}

export interface BaseResultAction<TPayload = any> extends BaseAction<TPayload> {
  meta: {
    completed: boolean;
    success: boolean;
  };
}

export interface BaseOfflineAction<TPayload = any, TEffect = BaseEffect>
  extends BaseAction<TPayload> {
  meta: {
    offline: {
      effect: TEffect;
      commit: BaseResultAction<TPayload>;
      rollback: BaseResultAction<TPayload>;
    };
  };
}

export type BaseApiParameters<TParams extends object = {}> = TParams & {
  townId: string;
}