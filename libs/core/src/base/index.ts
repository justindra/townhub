import { EntityId } from './interfaces';

export * from './database';
export * from './exceptions';
export * from './interfaces';

// The user id to use when the system is performing updates, etc
export const DEFAULT_ACTOR_ID: EntityId = 'th-user|system';
