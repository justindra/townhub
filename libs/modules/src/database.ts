import { Database } from '@townhub-libs/core';
import { DEFAULT_SECONDARY_INDEXES } from '@townhub-infra/cdk/constants';
import { MODULES_DATABASE } from './constants';
import { Module, ModuleEntity } from './interfaces';

export class ModulesDatabase extends Database<Module> {
  constructor() {
    super(MODULES_DATABASE.ENV, MODULES_DATABASE.ENTITY_TYPE);
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

export class BaseModuleDatabase<
  TItem extends ModuleEntity = any
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
