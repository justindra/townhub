import { BaseEntity } from '@townhub-libs/core';
import { MODULES_DATABASE, MODULE_TYPE } from './constants';

export type ModuleType = typeof MODULE_TYPE.TRANSIT;

export interface Module
  extends BaseEntity<typeof MODULES_DATABASE.ENTITY_TYPE> {
  /** The town this module belongs in */
  townId: string;
  /** The type of module this is */
  type: ModuleType;
  /** A human readable name to use */
  name: string;
  /** A short description on this module */
  description: string;
}

/**
 * The entity to extend from for all Entities that live under a module
 */
export interface ModuleEntity<TEntityType extends string>
  extends BaseEntity<TEntityType> {
  /** The town this entity belongs to */
  townId: string;
  /** The module this entity belongs to */
  moduleId: string;
}
