import type { SchemaProperty } from '@digital-net-org/digital-api-sdk';

export type DnColumnDefinition<T> =
    | { kind?: 'schema'; key: keyof T; label?: string }
    | {
          kind: 'preview';
          key: string;
          label?: string;
          getSrc: (_row: T) => string;
          alt?: (_row: T) => string;
          size?: number;
      };

export type ResolvedColumn<T = unknown> =
    | { kind: 'schema'; header: string; accessor: string; schema: SchemaProperty }
    | {
          kind: 'preview';
          header: string;
          accessor: string;
          size: number;
          getSrc: (_row: T) => string;
          alt?: (_row: T) => string;
      };

export function resolveColumns<T>(
    schema: SchemaProperty[],
    columns?: DnColumnDefinition<T>[]
): ResolvedColumn<T>[] {
    const base: ResolvedColumn<T>[] = schema
        .filter(prop => !prop.isSecret && !prop.isIdentity)
        .map(prop => ({
            kind: 'schema' as const,
            header: prop.name,
            accessor: prop.path.charAt(0).toLowerCase() + prop.path.slice(1),
            schema: prop,
        }));

    if (!columns || columns.length === 0) return base;

    const byAccessor = new Map(
        base.flatMap(c => (c.kind === 'schema' ? [[c.accessor, c] as const] : []))
    );

    return columns
        .map<ResolvedColumn<T> | null>(def => {
            if (def.kind === 'preview') {
                return {
                    kind: 'preview',
                    header: def.label ?? def.key,
                    accessor: def.key,
                    size: def.size ?? 40,
                    getSrc: def.getSrc,
                    alt: def.alt,
                };
            }
            const col = byAccessor.get(String(def.key));
            if (!col) return null;
            return { ...col, header: def.label ?? col.header };
        })
        .filter((c): c is ResolvedColumn<T> => c !== null);
}
