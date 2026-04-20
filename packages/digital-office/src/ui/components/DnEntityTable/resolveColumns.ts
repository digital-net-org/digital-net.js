import type { SchemaProperty } from '@digital-net-org/digital-api-sdk';

export interface DnColumnDefinition<T> {
    key: keyof T;
    label?: string;
}

export interface ResolvedColumn {
    header: string;
    accessor: string;
    schema: SchemaProperty;
}

export function resolveColumns<T>(schema: SchemaProperty[], columns?: DnColumnDefinition<T>[]): ResolvedColumn[] {
    const base = schema
        .filter(prop => !prop.isSecret && !prop.isIdentity)
        .map(prop => ({
            header: prop.name,
            accessor: prop.path.charAt(0).toLowerCase() + prop.path.slice(1),
            schema: prop,
        }));

    if (!columns || columns.length === 0) return base;

    const byAccessor = new Map(base.map(c => [c.accessor, c]));
    return columns
        .map(def => {
            const col = byAccessor.get(String(def.key));
            if (!col) return null;
            return { ...col, header: def.label ?? col.header };
        })
        .filter((c): c is ResolvedColumn => c !== null);
}
