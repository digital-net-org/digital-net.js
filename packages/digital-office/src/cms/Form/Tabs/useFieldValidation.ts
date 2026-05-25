import * as React from 'react';
import type { FieldChangeHandler, FieldRow } from './useFieldsState';

export type ValidationKey = 'minLength' | 'maxLength' | 'min' | 'max';

const VALIDATION_KEYS = ['minLength', 'maxLength', 'min', 'max'] as const;

function parseValidation(json: string | undefined): Partial<Record<ValidationKey, number>> {
    if (!json) return {};
    try {
        const parsed = JSON.parse(json) as Record<string, unknown>;
        const out: Partial<Record<ValidationKey, number>> = {};
        for (const key of VALIDATION_KEYS) {
            const value = parsed[key];
            if (typeof value === 'number' && Number.isFinite(value)) out[key] = value;
        }
        return out;
    } catch {
        return {};
    }
}

function serializeValidation(rules: Partial<Record<ValidationKey, number>>): string | undefined {
    const cleaned: Partial<Record<ValidationKey, number>> = {};
    for (const key of VALIDATION_KEYS) {
        const value = rules[key];
        if (typeof value === 'number' && Number.isFinite(value)) cleaned[key] = value;
    }
    return Object.keys(cleaned).length === 0 ? undefined : JSON.stringify(cleaned);
}

export function useFieldValidation(row: FieldRow, onFieldChange: FieldChangeHandler) {
    const validation = React.useMemo(() => parseValidation(row.validationJson), [row.validationJson]);

    const setValidation = React.useCallback(
        (key: ValidationKey, raw: string) => {
            const trimmed = raw.trim();
            const numeric = trimmed === '' ? undefined : Number(trimmed);
            const next: Partial<Record<ValidationKey, number>> = { ...validation };
            if (numeric === undefined || !Number.isFinite(numeric)) delete next[key];
            else next[key] = numeric;
            onFieldChange(row.id, 'validationJson', serializeValidation(next));
        },
        [onFieldChange, row.id, validation]
    );

    return { validation, setValidation };
}
