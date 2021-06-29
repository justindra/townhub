export const DEFAULT_SECONDARY_INDEXES = {
  BY_TOWN: { name: 'town-index', key: 'townId' },
  BY_MODULE: { name: 'module-index', key: 'moduleId' },
} as const;
