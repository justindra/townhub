export interface Town {
  id: string;
  /** A human-readable ID, can be used as a slug too */
  hid: string;
  /** The name of the town */
  name: string;
  /** The timezone the town is in, we might use this for defaults */
  timezone: string;
}
