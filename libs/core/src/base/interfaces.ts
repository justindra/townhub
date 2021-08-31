/**
 * The type used for the Id of every entity in the system. This is to insure
 * that a strict template (`th-[entityType]|[v4-uuid]`) is followed.
 *
 * Breaking it down:
 * - `th` a shorthand for Townhub, so everything is all created for Townhub and
 *   belongs to Townhub instead of an external system.
 * - `entityType` is the type of the entity, it should be a singular word
 *    rather than plural. For example:
 *     - `module`
 *     - `town`
 *     - `shuttle`
 * - `v4-uuid` A V4 UUID generated using the `uuid` library for node.
 *
 * The reason behind this structure is:
 * - We can look at an ID and know immediately what the entity type is without
 *   having to figure it out in the database. This is commonly used and takes
 *   inspiration from Slack and Auth0's ids for their entities.
 * - The UUID means that it should be very unique and hard to replicate,
 *   removing the need to even double check if there is a duplicate or not. The
 *   likelihood of it being non-unique is very small.
 */
export type EntityId<TEntityType extends string = string> =
  `th-${TEntityType}|${string}`;

/**
 * What every entity should look like inside of the Townhub system. This allows
 * us to have basic audit fields and have it tracked without the need for a
 * more complex system which we can add later on in the future.
 */
export type BaseEntity<TEntityType extends string> = {
  id: EntityId<TEntityType>;
  /** The time this entity was created */
  createdAt: number;
  /** The time this entity was last updated */
  updatedAt: number;
  /** The user who created this entity */
  createdBy: string;
  /** The user who last updated this entity */
  updatedBy: string;
};

/** A utility type to omit all the Audit Fields */
export type OmitAuditFields<TItem> = Omit<
  TItem,
  'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>;
/** A utility type to omit the id field */
export type OmitId<TItem> = Omit<TItem, 'id'>;
/**
 * The input to creating a new item in the database, it should have no audit
 * fields or id
 */
export type DatabaseCreateInput<TItem> = OmitAuditFields<OmitId<TItem>>;
/**
 * The input to updating an item in the database, it should just be a partial.
 */
export type DatabaseUpdateInput<TItem> = Partial<TItem>;
