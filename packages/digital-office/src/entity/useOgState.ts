import * as React from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { OpenGraphEntry, OpenGraphPropertySchema } from '@digital-net-org/digital-api-sdk';
import { useOgSchema } from './useOgSchema';

export interface OgRow {
    id: string;
    entityId?: string;
    property: string;
    content: string;
}

type RowField = keyof Omit<OgRow, 'id' | 'entityId'>;

export interface UseOgStateResult {
    rows: OgRow[];
    canAdd: boolean;
    options: OpenGraphPropertySchema[];
    handleAdd: () => void;
    handleDelete: (_id: string) => void;
    handlePropertyChange: (_id: string, _property: string) => void;
    handleContentChange: (_id: string, _content: string) => void;
    handleReorder: (_fromId: string, _toId: string) => void;
    rowErrors: Map<string, Set<RowField>>;
    isValid: boolean;
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

function computeRowErrors(rows: OgRow[]): Map<string, Set<RowField>> {
    const map = new Map<string, Set<RowField>>();
    for (const row of rows) {
        const errors = new Set<RowField>();
        if (!row.property.trim()) errors.add('property');
        if (!row.content.trim()) errors.add('content');
        if (errors.size > 0) map.set(row.id, errors);
    }
    return map;
}

export function useOgState(
    initialEntries: OpenGraphEntry[] | undefined,
    onChange: (_entries: OpenGraphEntry[]) => void,
    resetSignal?: number
): UseOgStateResult {
    const { schema } = useOgSchema();
    const [rows, setRows] = React.useState<OgRow[]>(() => toRows(initialEntries));
    const [lastInitial, setLastInitial] = React.useState(initialEntries);
    const [lastResetSignal, setLastResetSignal] = React.useState(resetSignal);
    const rowsRef = React.useRef(rows);
    const onChangeRef = React.useRef(onChange);

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

    React.useEffect(() => {
        rowsRef.current = rows;
    }, [rows]);

    React.useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const commit = React.useCallback((next: OgRow[]) => {
        setRows(next);
        rowsRef.current = next;
        onChangeRef.current(toEntries(next));
    }, []);

    const handleAdd = React.useCallback(() => {
        commit([...rowsRef.current, { id: crypto.randomUUID(), entityId: undefined, property: '', content: '' }]);
    }, [commit]);

    const handleDelete = React.useCallback(
        (id: string) => {
            commit(rowsRef.current.filter(r => r.id !== id));
        },
        [commit]
    );

    const handlePropertyChange = React.useCallback(
        (id: string, property: string) => {
            commit(rowsRef.current.map(r => (r.id === id ? { ...r, property } : r)));
        },
        [commit]
    );

    const handleContentChange = React.useCallback(
        (id: string, content: string) => {
            commit(rowsRef.current.map(r => (r.id === id ? { ...r, content } : r)));
        },
        [commit]
    );

    const handleReorder = React.useCallback(
        (fromId: string, toId: string) => {
            const current = rowsRef.current;
            const fromIndex = current.findIndex(r => r.id === fromId);
            const toIndex = current.findIndex(r => r.id === toId);
            if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
            commit(arrayMove(current, fromIndex, toIndex));
        },
        [commit]
    );

    const rowErrors = React.useMemo(() => computeRowErrors(rows), [rows]);
    const isValid = rowErrors.size === 0;

    return {
        rows,
        canAdd: schema.length > 0,
        options: schema,
        handleAdd,
        handleDelete,
        handlePropertyChange,
        handleContentChange,
        handleReorder,
        rowErrors,
        isValid,
    };
}
