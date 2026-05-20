import * as React from 'react';
import { Autocomplete, type AutocompleteProps, Paper, type PaperProps, type SxProps, type Theme } from '@mui/material';
import { DnStyledTextField } from './DnStyledTextField';
import { css, styled } from '@mui/material/styles';

type MuiAutocompleteOmitted =
    | 'renderInput'
    | 'value'
    | 'onChange'
    | 'options'
    | 'disabled'
    | 'multiple'
    | 'freeSolo'
    | 'disableClearable'
    | 'size'
    | 'getOptionLabel'
    | 'isOptionEqualToValue';

export interface DnInputAutocompleteProps<T = string> extends Omit<
    AutocompleteProps<T, false, false, false>,
    MuiAutocompleteOmitted | 'sx'
> {
    options: T[];
    value: T | null;
    onChange: (_value: T | null) => void;
    getOptionLabel?: (_option: T) => string;
    isOptionEqualToValue?: (_option: T, _value: T) => boolean;
    label?: React.ReactNode;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    helperText?: React.ReactNode;
    sx?: SxProps<Theme>;
    renderListAction?: React.ReactNode;
}

export function DnInputAutocomplete<T = string>({
    options,
    value,
    onChange,
    getOptionLabel,
    isOptionEqualToValue,
    label,
    placeholder,
    disabled,
    required,
    error,
    helperText,
    sx,
    renderListAction,
    ...autocompleteProps
}: DnInputAutocompleteProps<T>) {
    const resolvedGetOptionLabel = React.useMemo<((_option: T) => string) | undefined>(
        () =>
            getOptionLabel ?? (typeof options[0] === 'string' ? (option: T) => option as unknown as string : undefined),
        [getOptionLabel, options]
    );

    return (
        <Autocomplete<T>
            {...autocompleteProps}
            options={options}
            value={value}
            onChange={(_, next) => onChange(next ?? null)}
            disabled={disabled}
            autoHighlight
            sx={sx}
            getOptionLabel={resolvedGetOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            slots={{ paper: DnAutocompletePaper }}
            slotProps={{ paper: { renderListAction } as DnAutocompletePaperProps }}
            renderInput={params => (
                <DnStyledTextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={error}
                    helperText={helperText}
                    className="DnInput"
                />
            )}
        />
    );
}

type DnAutocompletePaperProps = PaperProps & { renderListAction?: React.ReactNode };

function DnAutocompletePaper({ renderListAction, children, ...paperProps }: DnAutocompletePaperProps) {
    return (
        <StyledPaper {...paperProps}>
            {children}
            {renderListAction !== undefined ? (
                <ActionsWrapper onMouseDown={event => event.preventDefault()}>{renderListAction}</ActionsWrapper>
            ) : null}
        </StyledPaper>
    );
}

const StyledPaper = styled(Paper)(
    ({ theme }) => css`
        & .MuiAutocomplete-listbox {
            font-size: ${theme.typography.button.fontSize};
        }
    `
);

const ActionsWrapper = styled('div')(
    ({ theme }) => css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        gap: ${theme.spacing(1)};
        padding: ${theme.spacing(1)};
    `
);
