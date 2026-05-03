import * as React from 'react';
import type { OpenGraphEntry, OpenGraphPropertySchema } from '@digital-net-org/digital-api-sdk';
import { useEntityRowsState } from '../../../entity';
import { useOgSchema } from './useOgSchema';

export interface OgRow {
    id: string;
    entityId?: string;
    property: string;
    content: string;
}

type RowField = keyof Omit<OgRow, 'id' | 'entityId'>;

const toRows = (entries: OpenGraphEntry[] | undefined): OgRow[] =>
    (entries ?? []).map(entry => ({
        id: crypto.randomUUID(),
        entityId: entry.id,
        property: entry.property,
        content: entry.content,
    }));

const toPayload = (rows: OgRow[]): OpenGraphEntry[] =>
    rows.map(({ entityId, property, content }) => ({ id: entityId, property, content }));

const payloadEqual = (a: OpenGraphEntry[] | undefined, b: OpenGraphEntry[] | undefined): boolean => {
    const aArr = a ?? [];
    const bArr = b ?? [];
    if (aArr.length !== bArr.length) return false;
    return aArr.every(
        (entry, i) =>
            entry.id === bArr[i].id && entry.property === bArr[i].property && entry.content === bArr[i].content
    );
};

const createRow = (): OgRow => ({
    id: crypto.randomUUID(),
    entityId: undefined,
    property: '',
    content: '',
});

const computeRowErrors = (rows: OgRow[]): Map<string, Set<string>> => {
    const map = new Map<string, Set<string>>();
    for (const row of rows) {
        const errors = new Set<string>();
        if (!row.property.trim()) errors.add('property');
        if (!row.content.trim()) errors.add('content');
        if (errors.size > 0) map.set(row.id, errors);
    }
    return map;
};

export function useOgState(
    initialEntries: OpenGraphEntry[] | undefined,
    onChange: (_entries: OpenGraphEntry[]) => void,
    resetSignal?: number
) {
    const { schema } = useOgSchema();
    const base = useEntityRowsState<OgRow, OpenGraphEntry>({
        initial: initialEntries,
        onChange,
        resetSignal,
        toRows,
        toPayload,
        payloadEqual,
        createRow,
        computeRowErrors,
    });

    const handlePropertyChange = React.useCallback(
        (id: string, property: string) => {
            base.commitWith(current => current.map(r => (r.id === id ? { ...r, property } : r)));
        },
        [base]
    );

    const handleContentChange = React.useCallback(
        (id: string, content: string) => {
            base.commitWith(current => current.map(r => (r.id === id ? { ...r, content } : r)));
        },
        [base]
    );

    return {
        rows: base.rows,
        canAdd: schema.length > 0,
        options: schema,
        handleAdd: base.handleAdd,
        handleDelete: base.handleDelete,
        handleReorder: base.handleReorder,
        handlePropertyChange,
        handleContentChange,
        rowErrors: base.rowErrors as Map<string, Set<RowField>>,
        isValid: base.isValid,
    };
}
