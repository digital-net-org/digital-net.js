import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { type TextFieldProps, TextField, CircularProgress, Stack } from '@mui/material';

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
    | 'error'
    | 'required'
    | 'autoFocus'
> {
    variant?: 'default' | 'text';
    loading?: boolean;
}

export function DnInput({ className, variant, loading, disabled, ...muiProps }: DnInputProps) {
    return (
        <CustomTextField
            {...muiProps}
            className={`DnInput ${className ?? ''}`}
            size="medium"
            variant={({ default: 'outlined', text: 'filled' } as const)[variant ?? 'default']}
            disabled={disabled || loading}
            slotProps={{
                input: {
                    endAdornment: (
                        <React.Fragment>
                            {loading ? (
                                <Stack position="absolute" right={8}>
                                    <CircularProgress size="1rem" />
                                </Stack>
                            ) : null}
                        </React.Fragment>
                    ),
                },
            }}
        />
    );
}

const basePaddingX = 0.25;
const basePaddingY = 0.5;

const CustomTextField = styled(TextField)(
    ({ theme }) => css`
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
