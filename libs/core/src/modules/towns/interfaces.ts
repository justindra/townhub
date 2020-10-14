import { BaseEntity } from '@townhub-libs/core/base/database';

interface ModuleSetting {
  /** The name of the module */
  name: 'shuttles';
}

export interface Town extends BaseEntity {
  /** A human-readable ID, can be used as a slug too */
  hid: string;
  /** The name of the town */
  name: string;
  /** The timezone the town is in, we might use this for defaults */
  timezone: string;
  /** The modules that has been assigned to this town and settings for it */
  modules: ModuleSetting[];
}
