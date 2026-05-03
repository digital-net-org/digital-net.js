import * as React from 'react';
import type { PageSheet, SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { computeRowErrors, useEntityRowsState } from '../../../entity';

const CONTENT_DEBOUNCE_MS = 500;

export interface SheetRow {
    id: string;
    entityId?: string;
    name: string;
    type: PageSheet['type'];
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

export function useSheetsState(
    initial: PageSheet[] | undefined,
    onChange: (_next: PageSheet[]) => void,
    resetSignal: number | undefined,
    schemas: SchemaProperty[]
): UseSheetsStateResult {
    const computeErrors = React.useCallback((rows: SheetRow[]) => computeRowErrors(rows, schemas), [schemas]);
    const base = useEntityRowsState<SheetRow, PageSheet>({
        initial,
        onChange,
        resetSignal,
        toRows,
        toPayload,
        payloadEqual,
        createRow,
        computeErrors,
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
