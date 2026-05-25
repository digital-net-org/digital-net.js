import * as React from 'react';
import type { FormFieldType } from '@digital-net-org/digital-api-sdk';

const PLACEHOLDER_TYPES: readonly FormFieldType[] = ['text', 'textarea', 'email', 'number'];
const DEFAULT_VALUE_TYPES: readonly FormFieldType[] = [
    'text',
    'textarea',
    'email',
    'number',
    'checkbox',
    'select',
    'radio',
];
const LENGTH_VALIDATION_TYPES: readonly FormFieldType[] = ['text', 'textarea', 'email'];
const RANGE_VALIDATION_TYPES: readonly FormFieldType[] = ['number'];
const OPTIONS_TYPES: readonly FormFieldType[] = ['select', 'radio'];

export function useFieldType(type: FormFieldType) {
    return React.useMemo(
        () => ({
            hasPlaceholder: PLACEHOLDER_TYPES.includes(type),
            hasDefaultValue: DEFAULT_VALUE_TYPES.includes(type),
            hasLengthValidation: LENGTH_VALIDATION_TYPES.includes(type),
            hasRangeValidation: RANGE_VALIDATION_TYPES.includes(type),
            hasOptions: OPTIONS_TYPES.includes(type),
        }),
        [type]
    );
}
