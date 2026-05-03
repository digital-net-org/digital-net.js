import * as React from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { PageSheet, SheetType } from '@digital-net-org/digital-api-sdk';

const VALID_TYPES: readonly SheetType[] = ['css', 'js', 'html'] as const;
const CONTENT_DEBOUNCE_MS = 300;

export interface SheetRow {
    id: string;
    entityId?: string;
    name: string;
    type: SheetType;
    content: string;
    published: boolean;
    expanded: boolean;
}

type RowField = keyof Omit<SheetRow, 'id' | 'entityId' | 'expanded'>;

export interface UseSheetsStateResult {
    rows: SheetRow[];
    handleAdd: () => void;
    handleDelete: (_rowId: string) => void;
    handleFieldChange: <K extends RowField>(_rowId: string, _field: K, _value: SheetRow[K]) => void;
    handleToggleExpand: (_rowId: string) => void;
    handleReorder: (_fromId: string, _toId: string) => void;
    rowErrors: Map<string, Set<RowField>>;
    isValid: boolean;
}

function toRows(initial: PageSheet[] | undefined): SheetRow[] {
    return (initial ?? []).map(sheet => ({
        id: crypto.randomUUID(),
        entityId: sheet.id,
        name: sheet.name,
        type: sheet.type,
        content: sheet.content,
        published: sheet.published,
        expanded: false,
    }));
}

function toPayload(rows: SheetRow[]): PageSheet[] {
    return rows.map(row => ({
        id: row.entityId,
        name: row.name,
        type: row.type,
        content: row.content,
        published: row.published,
    }));
}

function payloadEqual(a: PageSheet[] | undefined, b: PageSheet[] | undefined): boolean {
    const aArr = a ?? [];
    const bArr = b ?? [];
    if (aArr.length !== bArr.length) return false;
    return aArr.every(
        (entry, i) =>
            entry.id === bArr[i].id &&
            entry.name === bArr[i].name &&
            entry.type === bArr[i].type &&
            entry.content === bArr[i].content &&
            entry.published === bArr[i].published
    );
}

function computeRowErrors(rows: SheetRow[]): Map<string, Set<RowField>> {
    const map = new Map<string, Set<RowField>>();
    for (const row of rows) {
        const errors = new Set<RowField>();
        if (!row.name.trim()) errors.add('name');
        if (!VALID_TYPES.includes(row.type)) errors.add('type');
        if (!row.content.trim()) errors.add('content');
        if (errors.size > 0) map.set(row.id, errors);
    }
    return map;
}

export function useSheetsState(
    initial: PageSheet[] | undefined,
    onChange: (_next: PageSheet[]) => void,
    resetSignal?: number
): UseSheetsStateResult {
    const [rows, setRows] = React.useState<SheetRow[]>(() => toRows(initial));
    const [lastInitial, setLastInitial] = React.useState(initial);
    const [lastResetSignal, setLastResetSignal] = React.useState(resetSignal);
    const flushTimerRef = React.useRef<number | null>(null);
    const rowsRef = React.useRef(rows);
    const onChangeRef = React.useRef(onChange);

    if (initial !== lastInitial) {
        setLastInitial(initial);
        if (!payloadEqual(toPayload(rows), initial)) {
            setRows(toRows(initial));
        }
    }

    // Explicit reset: parent told us local edits were discarded. Re-init from `initial`
    // unconditionally — TanStack structural sharing may keep the same array ref even though
    // the user expects an UI reset, so we cannot rely on `initial !== lastInitial` here.
    if (resetSignal !== lastResetSignal) {
        setLastResetSignal(resetSignal);
        setRows(toRows(initial));
    }

    React.useEffect(() => {
        rowsRef.current = rows;
    }, [rows]);

    React.useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    React.useEffect(
        () => () => {
            if (flushTimerRef.current !== null) window.clearTimeout(flushTimerRef.current);
        },
        []
    );

    const flushNow = React.useCallback(() => {
        if (flushTimerRef.current !== null) {
            window.clearTimeout(flushTimerRef.current);
            flushTimerRef.current = null;
        }
        onChangeRef.current(toPayload(rowsRef.current));
    }, []);

    const flushDebounced = React.useCallback(() => {
        if (flushTimerRef.current !== null) window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = window.setTimeout(() => {
            flushTimerRef.current = null;
            onChangeRef.current(toPayload(rowsRef.current));
        }, CONTENT_DEBOUNCE_MS);
    }, []);

    const commit = React.useCallback(
        (next: SheetRow[], debounce: boolean) => {
            setRows(next);
            rowsRef.current = next;
            if (debounce) flushDebounced();
            else flushNow();
        },
        [flushDebounced, flushNow]
    );

    const handleAdd = React.useCallback(() => {
        const row: SheetRow = {
            id: crypto.randomUUID(),
            entityId: undefined,
            name: '',
            type: 'css',
            content: '',
            published: false,
            expanded: true,
        };
        commit([...rowsRef.current, row], false);
    }, [commit]);

    const handleDelete = React.useCallback(
        (rowId: string) => {
            commit(
                rowsRef.current.filter(r => r.id !== rowId),
                false
            );
        },
        [commit]
    );

    const handleFieldChange = React.useCallback(
        <K extends RowField>(rowId: string, field: K, value: SheetRow[K]) => {
            const next = rowsRef.current.map(r => (r.id === rowId ? { ...r, [field]: value } : r));
            commit(next, field === 'content');
        },
        [commit]
    );

    const handleToggleExpand = React.useCallback((rowId: string) => {
        setRows(current => current.map(r => (r.id === rowId ? { ...r, expanded: !r.expanded } : r)));
    }, []);

    const handleReorder = React.useCallback(
        (fromId: string, toId: string) => {
            const current = rowsRef.current;
            const fromIndex = current.findIndex(r => r.id === fromId);
            const toIndex = current.findIndex(r => r.id === toId);
            if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
            commit(arrayMove(current, fromIndex, toIndex), false);
        },
        [commit]
    );

    const rowErrors = React.useMemo(() => computeRowErrors(rows), [rows]);
    const isValid = rowErrors.size === 0;

    return {
        rows,
        handleAdd,
        handleDelete,
        handleFieldChange,
        handleToggleExpand,
        handleReorder,
        rowErrors,
        isValid,
    };
}
