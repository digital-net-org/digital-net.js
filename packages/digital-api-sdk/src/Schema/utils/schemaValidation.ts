import type { SchemaProperty } from '../SchemaProperty';

/**
 * Validate a payload from an entity schema.
 **/
export function schemaValidation<T>(values: Partial<T>, schemas: SchemaProperty[]): Set<string> {
    const missing = new Set<string>();
    const record = values as Record<string, unknown>;
    for (const s of schemas) {
        if (!s.isRequired || s.isReadOnly || s.isIdentity) continue;
        const accessor = `${s.name.charAt(0).toLowerCase()}${s.name.slice(1)}`;
        const v = record[accessor];
        const isEmpty = v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
        if (isEmpty) missing.add(accessor);
    }
    return missing;
}
