import * as React from 'react';
import { Autocomplete, type AutocompleteProps, type SxProps, type Theme } from '@mui/material';
import { DnStyledTextField } from './DnInput';

type MuiAutocompleteOmitted =
    | 'renderInput'
    | 'value'
    | 'onChange'
    | 'options'
    | 'disabled'
    | 'multiple'
    | 'freeSolo'
    | 'disableClearable'
    | 'size';

export interface DnInputAutocompleteProps extends Omit<
    AutocompleteProps<string, false, false, false>,
    MuiAutocompleteOmitted | 'sx'
> {
    options: string[];
    value: string;
    onChange: (_value: string) => void;
    label?: React.ReactNode;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    helperText?: React.ReactNode;
    sx?: SxProps<Theme>;
}

export function DnInputAutocomplete({
    options,
    value,
    onChange,
    label,
    placeholder,
    disabled,
    required,
    error,
    helperText,
    sx,
    ...autocompleteProps
}: DnInputAutocompleteProps) {
    return (
        <Autocomplete
            {...autocompleteProps}
            options={options}
            value={value || null}
            onChange={(_, next) => onChange(next ?? '')}
            disabled={disabled}
            autoHighlight
            sx={sx}
            renderInput={params => (
                <DnStyledTextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={error}
                    helperText={helperText}
                    className={`DnInput ${params.fullWidth ? '' : ''}`}
                />
            )}
        />
    );
}
