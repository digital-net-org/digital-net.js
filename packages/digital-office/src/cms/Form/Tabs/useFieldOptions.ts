import * as React from 'react';
import { JSONParser } from '@digital-net-org/digital-core';
import type { FieldChangeHandler, FieldRow } from './useFieldsState';

export interface OptionRowState {
    id: string;
    value: string;
}

function parseOptionsJson(json: string | undefined): string[] {
    if (!json) return [];
    const parsed = JSONParser.safeParse<unknown>(json);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
}

function toOptionRows(values: string[]) {
    return values.map(value => ({ id: crypto.randomUUID(), value }));
}

function cleanValues(rows: OptionRowState[]) {
    return rows.map(r => r.value).filter(v => v.trim() !== '');
}

export function useFieldOptions(row: FieldRow, onFieldChange: FieldChangeHandler) {
    const [optionRows, setOptionRows] = React.useState<OptionRowState[]>(() =>
        toOptionRows(parseOptionsJson(row.optionsJson))
    );

    const [lastSeed, setLastSeed] = React.useState(row.optionsJson);
    if (lastSeed !== row.optionsJson) {
        setLastSeed(row.optionsJson);
        const incoming = parseOptionsJson(row.optionsJson);
        const current = cleanValues(optionRows);
        const matchesIncoming = incoming.length === current.length && incoming.every((v, i) => v === current[i]);
        if (!matchesIncoming) setOptionRows(toOptionRows(incoming));
    }

    const validOptions = React.useMemo(() => cleanValues(optionRows), [optionRows]);

    const commitOptionRows = React.useCallback(
        (next: OptionRowState[]) => {
            setOptionRows(next);
            const cleaned = cleanValues(next);
            const serialized = cleaned.length === 0 ? undefined : JSON.stringify(cleaned);
            setLastSeed(serialized);
            onFieldChange(row.id, 'optionsJson', serialized);
            if (row.defaultValue && !cleaned.includes(row.defaultValue)) {
                onFieldChange(row.id, 'defaultValue', undefined);
            }
        },
        [onFieldChange, row.id, row.defaultValue]
    );

    const handleAddOption = React.useCallback(
        () => commitOptionRows([...optionRows, { id: crypto.randomUUID(), value: '' }]),
        [commitOptionRows, optionRows]
    );
    const handleEditOption = React.useCallback(
        (id: string, value: string) => commitOptionRows(optionRows.map(r => (r.id === id ? { ...r, value } : r))),
        [commitOptionRows, optionRows]
    );
    const handleRemoveOption = React.useCallback(
        (id: string) => commitOptionRows(optionRows.filter(r => r.id !== id)),
        [commitOptionRows, optionRows]
    );

    return { optionRows, validOptions, handleAddOption, handleEditOption, handleRemoveOption };
}
