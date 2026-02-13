import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { type ButtonProps, Button } from '@mui/material';
import type { Severity } from '../../theme';

export interface DnButtonProps extends Pick<
    ButtonProps,
    'children' | 'id' | 'className' | 'disabled' | 'loading' | 'size' | 'variant' | 'sx' | 'onClick'
> {
    icon?: React.ReactNode;
    severity?: Severity;
}

export function DnButton({ children, className, icon, severity, ...muiProps }: DnButtonProps) {
    const resolvedProps = React.useMemo(
        () => ({
            ...muiProps,
            ...(icon ? { endIcon: icon } : {}),
            ...(severity ? { color: severity } : {}),
            ...(muiProps.variant !== 'contained' ? { disableRipple: true } : {}),
        }),
        [muiProps, icon, severity]
    );

    return (
        <CustomButton {...resolvedProps} className={`DnButton ${className ?? ''}`}>
            {children}
        </CustomButton>
    );
}

const CustomButton = styled(Button)(
    ({ theme }) => css`
        text-transform: initial;
        transition: 0.2s ease-in-out;

        &.DnButton.MuiButton-contained {
            &.MuiButton-root.MuiButton-loading.Mui-disabled {
                background-color: ${theme.palette.primary.main};
                & .MuiButton-loadingIndicator .MuiCircularProgress-root .MuiCircularProgress-svg {
                    color: ${theme.palette.common.white};
                }
            }
        }

        &.DnButton.MuiButton-outlined {
            color: ${theme.palette.text.primary};
            border-color: ${theme.palette.text.primary};

            &:hover {
                color: ${theme.palette.primary.dark};
                border-color: ${theme.palette.primary.dark};
                background-color: transparent;
            }

            &.MuiButton-root.MuiButton-loading.Mui-disabled {
                color: transparent;

                & .MuiButton-loadingIndicator .MuiCircularProgress-root .MuiCircularProgress-svg {
                    color: ${theme.palette.common.white};
                }
            }

            &.MuiButton-root.Mui-disabled {
                color: ${theme.palette.text.disabled};
                border-color: ${theme.palette.text.disabled};
            }
        }

        &.DnButton.MuiButton-text {
            border: 1px solid transparent;

            &:hover {
                color: ${theme.palette.primary.dark};
                border-color: ${theme.palette.primary.dark};
                background-color: transparent;
            }

            &.MuiButton-root.MuiButton-loading.Mui-disabled {
                color: transparent;

                & .MuiButton-loadingIndicator .MuiCircularProgress-root .MuiCircularProgress-svg {
                    color: ${theme.palette.common.white};
                }
            }
        }
    `
);
