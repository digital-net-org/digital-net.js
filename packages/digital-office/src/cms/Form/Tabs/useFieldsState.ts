import * as React from 'react';
import type { FormFieldDto, FormFieldType, SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { computeRowErrors, useEntityRowsState } from '../../../entity';

export interface FieldRow {
    id: string;
    entityId?: string;
    name: string;
    type: FormFieldType;
    label: string;
    placeholder?: string;
    defaultValue?: string;
    required: boolean;
    sortOrder: number;
    validationJson?: string;
    optionsJson?: string;
}

export type FieldRowField = keyof Omit<FieldRow, 'id' | 'entityId' | 'sortOrder'>;

export type FieldChangeHandler = <K extends keyof FieldRow>(_id: string, _key: K, _value: FieldRow[K]) => void;

const toRows = (entries: FormFieldDto[] | undefined): FieldRow[] =>
    (entries ?? []).map((entry, index) => ({
        id: crypto.randomUUID(),
        entityId: entry.id,
        name: entry.name,
        type: entry.type,
        label: entry.label,
        placeholder: entry.placeholder,
        defaultValue: entry.defaultValue,
        required: entry.required,
        sortOrder: entry.sortOrder ?? index,
        validationJson: entry.validationJson,
        optionsJson: entry.optionsJson,
    }));

const toPayload = (rows: FieldRow[]): FormFieldDto[] =>
    rows.map((row, index) => ({
        id: row.entityId ?? '',
        formId: '',
        name: row.name,
        type: row.type,
        label: row.label,
        placeholder: row.placeholder,
        defaultValue: row.defaultValue,
        required: row.required,
        sortOrder: index,
        validationJson: row.validationJson,
        optionsJson: row.optionsJson,
        createdAt: '',
    }));

const payloadEqual = (a: FormFieldDto[] | undefined, b: FormFieldDto[] | undefined): boolean => {
    const aArr = a ?? [];
    const bArr = b ?? [];
    if (aArr.length !== bArr.length) return false;
    for (let i = 0; i < aArr.length; i += 1) {
        const x = aArr[i];
        const y = bArr[i];
        if (
            x.id !== y.id ||
            x.name !== y.name ||
            x.type !== y.type ||
            x.label !== y.label ||
            x.placeholder !== y.placeholder ||
            x.defaultValue !== y.defaultValue ||
            x.required !== y.required ||
            x.sortOrder !== y.sortOrder ||
            x.validationJson !== y.validationJson ||
            x.optionsJson !== y.optionsJson
        ) {
            return false;
        }
    }
    return true;
};

const createRow = (): FieldRow => ({
    id: crypto.randomUUID(),
    entityId: undefined,
    name: '',
    type: 'text',
    label: '',
    placeholder: undefined,
    defaultValue: undefined,
    required: false,
    sortOrder: 0,
    validationJson: undefined,
    optionsJson: undefined,
});

export function useFieldsState(
    initialEntries: FormFieldDto[] | undefined,
    onChange: (_entries: FormFieldDto[]) => void,
    resetSignal: number | undefined,
    schemas: SchemaProperty[]
) {
    const computeErrors = React.useCallback((rows: FieldRow[]) => computeRowErrors(rows, schemas), [schemas]);
    const base = useEntityRowsState<FieldRow, FormFieldDto>({
        initial: initialEntries,
        onChange,
        resetSignal,
        toRows,
        toPayload,
        payloadEqual,
        createRow,
        computeErrors,
    });

    const handleFieldChange = React.useCallback(
        <K extends keyof FieldRow>(id: string, key: K, value: FieldRow[K]) => {
            base.commitWith(current => current.map(r => (r.id === id ? { ...r, [key]: value } : r)));
        },
        [base]
    );

    return {
        rows: base.rows,
        handleAdd: base.handleAdd,
        handleDelete: base.handleDelete,
        handleReorder: base.handleReorder,
        handleFieldChange,
        rowErrors: base.rowErrors as Map<string, Set<FieldRowField>>,
        isValid: base.isValid,
    };
}
