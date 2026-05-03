import * as React from 'react';
import type { OpenGraphEntry, OpenGraphPropertySchema } from '@digital-net-org/digital-api-sdk';
import { useOgSchema } from './useOgSchema';

export interface OgRow {
    id: string;             // local UUID, stable across re-renders
    entityId?: string;      // OpenGraphEntry.id from the DB if it exists
    property: string;
    content: string;
}

export interface UseOgStateResult {
    rows: OgRow[];
    canAdd: boolean;
    options: OpenGraphPropertySchema[];
    handleAdd: () => void;
    handleDelete: (_id: string) => void;
    handlePropertyChange: (_id: string, _property: string) => void;
    handleContentChange: (_id: string, _content: string) => void;
}

const toRows = (entries: OpenGraphEntry[] | undefined): OgRow[] =>
    (entries ?? []).map(entry => ({
        id: crypto.randomUUID(),
        entityId: entry.id,
        property: entry.property,
        content: entry.content,
    }));

const toEntries = (rows: OgRow[]): OpenGraphEntry[] =>
    rows.map(({ entityId, property, content }) => ({ id: entityId, property, content }));

const entriesEqual = (a: OpenGraphEntry[] | undefined, b: OpenGraphEntry[] | undefined): boolean => {
    const aArr = a ?? [];
    const bArr = b ?? [];
    if (aArr.length !== bArr.length) return false;
    return aArr.every(
        (entry, i) =>
            entry.id === bArr[i].id && entry.property === bArr[i].property && entry.content === bArr[i].content
    );
};

export function useOgState(
    initialEntries: OpenGraphEntry[] | undefined,
    onChange: (_entries: OpenGraphEntry[]) => void,
    resetSignal?: number
): UseOgStateResult {
    const { schema } = useOgSchema();
    const [rows, setRows] = React.useState<OgRow[]>(() => toRows(initialEntries));
    const [lastInitial, setLastInitial] = React.useState(initialEntries);
    const [lastResetSignal, setLastResetSignal] = React.useState(resetSignal);

    // Sync from upstream when the `initialEntries` reference changes AND its content differs
    // from the current rows. Done during render (not in an effect) to avoid the cascading
    // re-render warned about by `react-hooks/set-state-in-effect`.
    if (initialEntries !== lastInitial) {
        setLastInitial(initialEntries);
        if (!entriesEqual(toEntries(rows), initialEntries)) {
            setRows(toRows(initialEntries));
        }
    }

    // Explicit reset: parent told us local edits were discarded. Re-init from `initialEntries`
    // unconditionally — TanStack structural sharing may keep the same array ref even though
    // the user expects an UI reset, so we cannot rely on `initialEntries !== lastInitial`.
    if (resetSignal !== lastResetSignal) {
        setLastResetSignal(resetSignal);
        setRows(toRows(initialEntries));
    }

    const updateRows = (next: OgRow[]) => {
        setRows(next);
        onChange(toEntries(next));
    };

    const handleAdd = () =>
        updateRows([...rows, { id: crypto.randomUUID(), entityId: undefined, property: '', content: '' }]);
    const handleDelete = (id: string) => updateRows(rows.filter(r => r.id !== id));
    const handlePropertyChange = (id: string, property: string) =>
        updateRows(rows.map(r => (r.id === id ? { ...r, property } : r)));
    const handleContentChange = (id: string, content: string) =>
        updateRows(rows.map(r => (r.id === id ? { ...r, content } : r)));

    return {
        rows,
        canAdd: schema.length > 0,
        options: schema,
        handleAdd,
        handleDelete,
        handlePropertyChange,
        handleContentChange,
    };
}
