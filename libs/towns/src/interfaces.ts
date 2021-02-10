import { BaseEntity } from '@townhub-libs/models';

interface ModuleSetting {
  /** The name to show it to people */
  name: string;
  /** The type of the module */
  type: 'shuttles' | 'vendors';
  /** A slug to use in the frontend. This should be unique for the whole module array */
  slug: string;
  /** Description of the module instance */
  description: string;
  /** The icon to use to show in the app, it should be a font-awesome icon */
  icon: string | string[];
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
