import type { EntityName } from '@digital-net-org/digital-api-sdk';

export const DN_KEY_ENTITY_LIST = 'dn-entity-list';
export const DN_KEY_ENTITY_GET = 'dn-entity-get';

export function buildKeyFromId(entityName: EntityName, id: string) {
    return [entityName, DN_KEY_ENTITY_GET, id];
}

export function buildListKey(entityName: EntityName) {
    return [entityName, DN_KEY_ENTITY_LIST];
}
