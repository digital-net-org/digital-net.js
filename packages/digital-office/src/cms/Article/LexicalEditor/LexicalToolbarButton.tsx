import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { css, styled } from '@mui/material/styles';

interface LexicalToolbarButtonProps {
    children?: React.ReactNode;
    label: string;
    disabled?: boolean;
    onClick?: () => void;
}

export function LexicalToolbarButton({ children, label, ...iconButtonProps }: LexicalToolbarButtonProps) {
    return (
        <Tooltip title={label}>
            <Button size="small" {...iconButtonProps}>
                {children}
            </Button>
        </Tooltip>
    );
}

const Button = styled(IconButton)(
    ({ theme }) => css`
        & .MuiSvgIcon-root {
            width: ${theme.typography.fontSize * 1.25}px;
            height: ${theme.typography.fontSize * 1.25}px;
        }
    `
);
