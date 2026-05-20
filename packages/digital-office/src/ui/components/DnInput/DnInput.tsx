import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import {
    type TextFieldProps,
    type SlotProps,
    type TextFieldOwnerState,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import type { InputBaseProps } from '@mui/material/InputBase';
import { basePaddingY, DnStyledTextField } from './DnStyledTextField';

export interface DnInputProps extends Pick<
    TextFieldProps,
    | 'id'
    | 'className'
    | 'disabled'
    | 'sx'
    | 'name'
    | 'label'
    | 'placeholder'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'type'
    | 'fullWidth'
    | 'multiline'
    | 'rows'
    | 'minRows'
    | 'maxRows'
    | 'error'
    | 'required'
    | 'autoFocus'
    | 'helperText'
> {
    variant?: 'default' | 'text';
    loading?: boolean;
    loadingNonBlocking?: boolean;
    max?: number;
    pattern?: string;
    inputProps?: SlotProps<React.ElementType<InputBaseProps['inputProps']>, {}, TextFieldOwnerState>;
}

const DEFAULT_PATTERN_ERROR = 'Format invalide.';

export function DnInput({
    className,
    variant,
    loading,
    loadingNonBlocking,
    disabled,
    max,
    inputProps,
    pattern,
    error,
    helperText,
    value,
    onChange,
    ...muiProps
}: DnInputProps) {
    const [uncontrolledLength, setUncontrolledLength] = React.useState(
        typeof muiProps.defaultValue === 'string' ? muiProps.defaultValue.length : 0
    );
    const [patternMismatch, setPatternMismatch] = React.useState(false);

    const valueLength = typeof value === 'string' ? value.length : uncontrolledLength;
    const resolvedMaxLength = max ?? (inputProps as { maxLength?: number } | undefined)?.maxLength;
    const effectiveError = Boolean(error) || patternMismatch;
    const effectiveHelper = patternMismatch ? DEFAULT_PATTERN_ERROR : helperText;

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (max !== undefined) {
            setUncontrolledLength(event.target.value.length);
        }
        if (pattern !== undefined) {
            setPatternMismatch(event.target.validity.patternMismatch);
        }
        onChange?.(event);
    };

    return (
        <Wrapper>
            {max !== undefined ? (
                <Counter>
                    {valueLength}/{max}
                </Counter>
            ) : null}
            <DnStyledTextField
                {...muiProps}
                value={value ?? ''}
                onChange={handleOnChange}
                error={effectiveError}
                helperText={effectiveHelper}
                className={`DnInput ${className ?? ''}`}
                size="medium"
                variant={({ default: 'outlined', text: 'filled' } as const)[variant ?? 'default']}
                disabled={disabled || loading}
                slotProps={{
                    htmlInput: {
                        spellCheck: false,
                        autoCorrect: 'off',
                        autoCapitalize: 'off',
                        autoComplete: 'off',
                        ...(inputProps ?? {}),
                        ...(resolvedMaxLength !== undefined ? { maxLength: resolvedMaxLength } : {}),
                        ...(pattern !== undefined ? { pattern } : {}),
                    },
                    input: {
                        endAdornment:
                            loading || loadingNonBlocking ? (
                                <Stack sx={{ position: 'absolute', right: 8 }}>
                                    <CircularProgress size="1rem" />
                                </Stack>
                            ) : undefined,
                    },
                }}
            />
        </Wrapper>
    );
}

const Wrapper = styled('div')(
    () => css`
        position: relative;
        width: 100%;
    `
);

const Counter = styled(Typography)(
    ({ theme }) => css`
        position: absolute;
        top: -0.75rem;
        right: ${basePaddingY}rem;
        z-index: 1;
        font-size: 0.7rem;
        line-height: 1;
        color: ${theme.palette.text.secondary};
        pointer-events: none;
        user-select: none;
    `
);
