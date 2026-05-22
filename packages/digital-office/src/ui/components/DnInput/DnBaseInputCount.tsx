import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { basePaddingY } from './DnBaseInput';

export interface DnBaseInputCountProps {
    value: number | null | undefined;
    max: number | null | undefined;
}

export function DnBaseInputCount({ value, max }: DnBaseInputCountProps) {
    return max ? (
        <Count>
            {value}/{max}
        </Count>
    ) : null;
}

export const Count = styled(Typography)(
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
