import type { EntityName } from './EntityName';

export const CRUD_ENTITY_NAMES = [
    'article',
    'page',
    'media',
    'tag',
    'form',
    'configValue',
] as const satisfies readonly EntityName[];

export type CrudEntityName = (typeof CRUD_ENTITY_NAMES)[number];
