import type * as React from 'react';
import { Stack } from '@mui/material';
import { styled, css } from '@mui/material/styles';

export function DnTableView({ children }: { children: React.ReactNode }) {
    return <View>{children}</View>;
}

const View = styled(Stack)(
    ({ theme }) => css`
        width: 100%;
        height: 100%;
    `
);
