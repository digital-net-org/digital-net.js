import * as React from 'react';
import type { OpenGraphEntry, OpenGraphPropertySchema } from '@digital-net-org/digital-api-sdk';
import { useOgSchema } from './useOgSchema';

export interface OgRow {
    id: string;
    property: string;
    content: string;
}

export interface UseOgStateResult {
    rows: OgRow[];
    canAdd: boolean;
    handleAdd: () => void;
    handleDelete: (_id: string) => void;
    handlePropertyChange: (_id: string, _property: string) => void;
    handleContentChange: (_id: string, _content: string) => void;
    optionsFor: (_row: OgRow) => OpenGraphPropertySchema[];
}

const toRows = (entries: OpenGraphEntry[] | undefined): OgRow[] =>
    (entries ?? []).map(entry => ({
        id: crypto.randomUUID(),
        property: entry.property,
        content: entry.content,
    }));

const toEntries = (rows: OgRow[]): OpenGraphEntry[] => rows.map(({ property, content }) => ({ property, content }));

const entriesEqual = (a: OpenGraphEntry[] | undefined, b: OpenGraphEntry[] | undefined): boolean => {
    const aArr = a ?? [];
    const bArr = b ?? [];
    if (aArr.length !== bArr.length) return false;
    return aArr.every((entry, i) => entry.property === bArr[i].property && entry.content === bArr[i].content);
};

export function useOgState(
    initialEntries: OpenGraphEntry[] | undefined,
    onChange: (_entries: OpenGraphEntry[] | null) => void
): UseOgStateResult {
    const { schema } = useOgSchema();
    const [rows, setRows] = React.useState<OgRow[]>(() => toRows(initialEntries));

    React.useEffect(() => {
        setRows(current => (entriesEqual(toEntries(current), initialEntries) ? current : toRows(initialEntries)));
    }, [initialEntries]);

    const usedKeyCounts = React.useMemo(() => {
        const counts = new Map<string, number>();
        for (const row of rows) {
            if (!row.property) continue;
            counts.set(row.property, (counts.get(row.property) ?? 0) + 1);
        }
        return counts;
    }, [rows]);

    const canAdd = schema.some(p => p.allowMultiple || (usedKeyCounts.get(p.key) ?? 0) === 0);

    const updateRows = (next: OgRow[]) => {
        setRows(next);
        const entries = toEntries(next);
        onChange(entries.length > 0 ? entries : null);
    };

    const handleAdd = () => updateRows([...rows, { id: crypto.randomUUID(), property: '', content: '' }]);
    const handleDelete = (id: string) => updateRows(rows.filter(r => r.id !== id));
    const handlePropertyChange = (id: string, property: string) =>
        updateRows(rows.map(r => (r.id === id ? { ...r, property } : r)));
    const handleContentChange = (id: string, content: string) =>
        updateRows(rows.map(r => (r.id === id ? { ...r, content } : r)));

    const optionsMap = React.useMemo(() => {
        const map = new Map<string, OpenGraphPropertySchema[]>();
        for (const row of rows) {
            map.set(
                row.id,
                schema.filter(p => p.allowMultiple || (usedKeyCounts.get(p.key) ?? 0) === 0 || p.key === row.property)
            );
        }
        return map;
    }, [rows, schema, usedKeyCounts]);

    const optionsFor = React.useCallback((row: OgRow) => optionsMap.get(row.id) ?? [], [optionsMap]);

    return {
        rows,
        canAdd,
        handleAdd,
        handleDelete,
        handlePropertyChange,
        handleContentChange,
        optionsFor,
    };
}
