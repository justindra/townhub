import { BaseEntity } from '@townhub-libs/models';

export interface User extends BaseEntity {
  /** The user's sub from different platforms */
  subs: string[];
}
