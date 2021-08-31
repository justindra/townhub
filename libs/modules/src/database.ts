import { DEFAULT_SECONDARY_INDEXES } from '@townhub-libs/constants';
import {
  Database,
  DatabaseCreateInput,
  NotFoundException,
  ValidationException,
} from '@townhub-libs/core';
import { TownsDatabase } from '@townhub-libs/towns';
import { AVAILABLE_MODULES, MODULES_DATABASE } from './constants';
import { Module, ModuleEntity } from './interfaces';

export class ModulesDatabase extends Database<
  Module,
  typeof MODULES_DATABASE.ENTITY_TYPE
> {
  /**
   * @param TownsClient Pass in an instance of TownsClient
   */
  constructor(private TownsClient: TownsDatabase = new TownsDatabase()) {
    super(MODULES_DATABASE.ENV, MODULES_DATABASE.ENTITY_TYPE);
  }

  /**
   * Create a new module. The town to add the module to must exist
   * @param item The module to create
   * @param actorId The user creating the module
   */
  async create(item: DatabaseCreateInput<Module>, actorId: string) {
    // Make sure type is correct
    if (!AVAILABLE_MODULES.includes(item.type)) {
      throw new ValidationException(
        `Unable to create module of type ${item.type} as type is invalid`
      );
    }

    // Make sure the town being used actually exists
    try {
      await this.TownsClient.get(item.townId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new ValidationException(
          `Unable to create module for town ${item.townId} as town does not exist`
        );
      }
    }

    return super.create(item, actorId);
  }

  /**
   * List all modules by the townId
   * @param townId The id of the town to search by
   */
  async listByTownId(townId: string) {
    const res = await this.query({
      IndexName: DEFAULT_SECONDARY_INDEXES.BY_TOWN.name,
      KeyConditionExpression: `#key = :value`,
      ExpressionAttributeNames: {
        '#key': DEFAULT_SECONDARY_INDEXES.BY_TOWN.key,
      },
      ExpressionAttributeValues: { ':value': townId },
    });

    return res;
  }
}

/**
 * The Database to extend from for all entities that live under a particular
 * module.
 */
export class BaseModuleDatabase<
  TItem extends ModuleEntity<TEntityType> = any,
  TEntityType extends string = string
> extends Database<TItem> {
  /**
   * List all items by the townId
   * @param townId The id of the town to search by
   */
  async listByTownId(townId: string) {
    const res = await this.query({
      IndexName: DEFAULT_SECONDARY_INDEXES.BY_TOWN.name,
      KeyConditionExpression: `#key = :value`,
      ExpressionAttributeNames: {
        '#key': DEFAULT_SECONDARY_INDEXES.BY_TOWN.key,
      },
      ExpressionAttributeValues: { ':value': townId },
    });

    return res;
  }

  /**
   * List all items by the moduleId
   * @param moduleId The id of the module to search by
   */
  async listByModuleId(moduleId: string) {
    const res = await this.query({
      IndexName: DEFAULT_SECONDARY_INDEXES.BY_MODULE.name,
      KeyConditionExpression: `#key = :value`,
      ExpressionAttributeNames: {
        '#key': DEFAULT_SECONDARY_INDEXES.BY_MODULE.key,
      },
      ExpressionAttributeValues: { ':value': moduleId },
    });

    return res;
  }
}
