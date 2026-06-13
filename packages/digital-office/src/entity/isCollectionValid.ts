import type { SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { computeRowErrors } from './computeRowErrors';

export function isCollectionValid(items: readonly unknown[] | undefined, schemas: SchemaProperty[]): boolean {
    if (!items || items.length === 0) return true;
    const rows = items.map((item, index) => ({ ...(item as object), id: String(index) }));
    return computeRowErrors(rows, schemas).size === 0;
}
