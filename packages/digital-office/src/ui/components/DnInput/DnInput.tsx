import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import {
    type TextFieldProps,
    type SlotProps,
    type TextFieldOwnerState,
    TextField,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import type { InputBaseProps } from '@mui/material/InputBase';

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
    regex?: RegExp;
    inputProps?: SlotProps<React.ElementType<InputBaseProps['inputProps']>, {}, TextFieldOwnerState>;
}

const DEFAULT_REGEX_ERROR = 'Format invalide.';

export function DnInput({
    className,
    variant,
    loading,
    loadingNonBlocking,
    disabled,
    max,
    inputProps,
    regex,
    error,
    helperText,
    ...muiProps
}: DnInputProps) {
    const [uncontrolledLength, setUncontrolledLength] = React.useState(
        typeof muiProps.defaultValue === 'string' ? muiProps.defaultValue.length : 0
    );
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
        typeof muiProps.defaultValue === 'string' ? muiProps.defaultValue : ''
    );

    const valueLength = typeof muiProps.value === 'string' ? muiProps.value.length : uncontrolledLength;
    const resolvedMaxLength = max ?? (inputProps as { maxLength?: number } | undefined)?.maxLength;
    const effectiveValue = typeof muiProps.value === 'string' ? muiProps.value : uncontrolledValue;
    const regexMismatch = regex !== undefined && effectiveValue !== '' && !regex.test(effectiveValue);
    const effectiveError = Boolean(error) || regexMismatch;
    const effectiveHelper = regexMismatch ? DEFAULT_REGEX_ERROR : helperText;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (max !== undefined) {
            setUncontrolledLength(event.target.value.length);
        }
        if (regex !== undefined && typeof muiProps.value !== 'string') {
            setUncontrolledValue(event.target.value);
        }
        muiProps.onChange?.(event);
    };

    return (
        <Wrapper>
            {max !== undefined ? (
                <Counter>
                    {valueLength}/{max}
                </Counter>
            ) : null}
            <CustomTextField
                {...muiProps}
                error={effectiveError}
                helperText={effectiveHelper}
                onChange={onChange}
                className={`DnInput ${className ?? ''}`}
                size="medium"
                variant={({ default: 'outlined', text: 'filled' } as const)[variant ?? 'default']}
                disabled={disabled || loading}
                slotProps={{
                    htmlInput: {
                        ...(inputProps ?? {}),
                        ...(resolvedMaxLength !== undefined ? { maxLength: resolvedMaxLength } : {}),
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

const basePaddingX = 0.25;
const basePaddingY = 0.5;

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

const CustomTextField = styled(TextField)(
    ({ theme }) => css`
        width: 100%;
        & .MuiInputBase-root {
            transition: 0.2s ease-in-out;
            font-size: ${theme.typography.button.fontSize};
            background-color: transparent;

            &.MuiInputBase-adornedEnd {
                padding-right: 0;
            }
        }

        & .MuiInputBase-input {
            padding: ${basePaddingX}rem ${basePaddingY}rem;
        }

        & .MuiInputLabel-outlined.MuiInputLabel-root {
            font-size: ${theme.typography.button.fontSize};
            transform: translate(${basePaddingY}rem, ${basePaddingX}rem) scale(1);

            &.MuiInputLabel-shrink {
                transform: translate(${basePaddingY * 1.75}rem, -${basePaddingX * 2.6}rem) scale(0.75);
            }
        }

        & .MuiInputLabel-filled.MuiInputLabel-root {
            font-size: ${theme.typography.button.fontSize};
            transform: translate(${basePaddingY}rem, ${basePaddingX}rem) scale(1);

            &.MuiInputLabel-shrink {
                transform: translate(${basePaddingY}rem, -${basePaddingX * 2.25}rem) scale(0.75);
            }
        }

        &.DnInput .MuiInputLabel-root {
            color: ${theme.palette.text.secondary};

            &.Mui-focused {
                color: ${theme.palette.primary.main};
            }

            &.Mui-disabled {
                color: ${theme.palette.text.disabled};
            }
        }

        & .MuiFormHelperText-root {
            margin: 0;
            padding-left: 0.5rem;
        }
    `
);
