import type { SchemaProperty } from '@digital-net-org/digital-api-sdk';

export function computeRowErrors<TRow extends { id: string }>(
    rows: TRow[],
    schemas: SchemaProperty[]
): Map<string, Set<string>> {
    const map = new Map<string, Set<string>>();
    if (schemas.length === 0) return map;
    for (const row of rows) {
        const errors = new Set<string>();
        const record = row as unknown as Record<string, unknown>;

        for (const s of schemas) {
            if (s.isReadOnly || s.isIdentity) continue;
            const accessor = `${s.name.charAt(0).toLowerCase()}${s.name.slice(1)}`;
            const value = record[accessor];
            const isString = typeof value === 'string';
            const isEmpty = value === undefined || value === null || (isString && value.trim() === '');

            if (s.isRequired && isEmpty) {
                errors.add(accessor);
                continue;
            }

            if (isString && !isEmpty) {
                if (s.maxLength != null && value.length > s.maxLength) errors.add(accessor);
                else if (s.regexValidation != null && !new RegExp(s.regexValidation).test(value)) errors.add(accessor);
                else if (s.oneOfValues != null && !s.oneOfValues.includes(value)) errors.add(accessor);
            }
        }
        if (errors.size > 0) map.set(row.id, errors);
    }
    return map;
}
