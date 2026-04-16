import type { SchemaProperty } from '@digital-net-org/digital-api-sdk';

export interface ResolvedColumn {
    header: string;
    accessor: string;
    schema: SchemaProperty;
}

export function resolveColumns<T>(
    schema: SchemaProperty[],
    columns?: (keyof T)[],
): ResolvedColumn[] {
    const resolved = schema
        .filter((prop) => !prop.isSecret && !prop.isIdentity)
        .map((prop) => ({
            header: prop.name,
            accessor: prop.path.charAt(0).toLowerCase() + prop.path.slice(1),
            schema: prop,
        }));

    if (!columns || columns.length === 0) return resolved;

    const allowed = new Set(columns.map(String));
    return resolved.filter((col) => allowed.has(col.accessor));
}
