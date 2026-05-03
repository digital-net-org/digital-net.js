import * as React from 'react';
import type { PageSheet, SheetType } from '@digital-net-org/digital-api-sdk';
import { useEntityRowsState } from '../../../entity';

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

const toRows = (initial: PageSheet[] | undefined): SheetRow[] =>
    (initial ?? []).map(sheet => ({
        id: crypto.randomUUID(),
        entityId: sheet.id,
        name: sheet.name,
        type: sheet.type,
        content: sheet.content,
        published: sheet.published,
        expanded: false,
    }));

const toPayload = (rows: SheetRow[]): PageSheet[] =>
    rows.map(row => ({
        id: row.entityId,
        name: row.name,
        type: row.type,
        content: row.content,
        published: row.published,
    }));

const payloadEqual = (a: PageSheet[] | undefined, b: PageSheet[] | undefined): boolean => {
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
};

const createRow = (): SheetRow => ({
    id: crypto.randomUUID(),
    entityId: undefined,
    name: '',
    type: 'css',
    content: '',
    published: false,
    expanded: true,
});

const computeRowErrors = (rows: SheetRow[]): Map<string, Set<string>> => {
    const map = new Map<string, Set<string>>();
    for (const row of rows) {
        const errors = new Set<string>();
        if (!row.name.trim()) errors.add('name');
        if (!VALID_TYPES.includes(row.type)) errors.add('type');
        if (!row.content.trim()) errors.add('content');
        if (errors.size > 0) map.set(row.id, errors);
    }
    return map;
};

export function useSheetsState(
    initial: PageSheet[] | undefined,
    onChange: (_next: PageSheet[]) => void,
    resetSignal?: number
): UseSheetsStateResult {
    const base = useEntityRowsState<SheetRow, PageSheet>({
        initial,
        onChange,
        resetSignal,
        toRows,
        toPayload,
        payloadEqual,
        createRow,
        computeRowErrors,
        debounceMs: CONTENT_DEBOUNCE_MS,
    });

    const handleFieldChange = React.useCallback(
        <K extends RowField>(rowId: string, field: K, value: SheetRow[K]) => {
            base.commitWith(current => current.map(r => (r.id === rowId ? { ...r, [field]: value } : r)), {
                debounce: field === 'content',
            });
        },
        [base]
    );

    const handleToggleExpand = React.useCallback(
        (rowId: string) => {
            base.setRowsLocal(current => current.map(r => (r.id === rowId ? { ...r, expanded: !r.expanded } : r)));
        },
        [base]
    );

    return {
        rows: base.rows,
        handleAdd: base.handleAdd,
        handleDelete: base.handleDelete,
        handleFieldChange,
        handleToggleExpand,
        handleReorder: base.handleReorder,
        rowErrors: base.rowErrors as Map<string, Set<RowField>>,
        isValid: base.isValid,
    };
}
