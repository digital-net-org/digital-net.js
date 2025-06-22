import React from 'react';
import type { BaseInputProps } from './types';

export interface InputPatternProps {
    pattern?: string;
    maxLength?: number;
}

export function useInputPattern({
    onChange,
    loading,
    required,
    pattern,
    maxLength,
}: BaseInputProps & InputPatternProps & { onChange?: (value: string) => void }) {
    const [error, setError] = React.useState(false);

    const testValue = React.useCallback((value: string) => !pattern || new RegExp(pattern).test(value), [pattern]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (loading || (maxLength && (e.target.value.length ?? 0) > maxLength)) {
            return;
        }
        const isValid = (e.target.value !== '' && testValue(e.target.value)) || (e.target.value === '' && !required);
        if (isValid) {
            setError(false);
        }
        onChange?.(e.target.value);
    };

    return {
        handleChange,
        handleError: () => setError(true),
        handleInvalid: () => setError(true),
        error,
    };
}
