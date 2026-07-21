import * as React from 'react';
import { Box, type BoxProps } from '@mui/material';
import { css, styled } from '@mui/material/styles';

const StyledFrame = styled(Box)(
    ({ theme }) => css`
        position: relative;
        border: 1px solid ${theme.palette.divider};
        border-radius: ${theme.shape.borderRadius}px;
        overflow: hidden;
        transition: border-color 0.2s ease-in-out;
        height: 100%;
        width: 100%;

        &:focus-within {
            border-color: ${theme.palette.primary.main};
        }

        &[data-disabled] {
            opacity: 0.35;
            pointer-events: none;
            cursor: not-allowed;
            border-color: ${theme.palette.action.disabled};
        }

        &[data-error] {
            border-color: ${theme.palette.error.main};
        }
    `
);

// Shared editor chrome: a bordered box that reacts to focus, disabled and error state
// through data attributes, so both the code and rich text editors read identically.
export function DnEditorFrame(props: BoxProps) {
    return <StyledFrame {...props} />;
}
