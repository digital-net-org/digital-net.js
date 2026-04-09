import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { Drawer as MuiDrawer } from '@mui/material';

export interface DnAppDrawerProps extends React.PropsWithChildren {
    open?: boolean;
}

export function DnAppDrawer({ open, children }: DnAppDrawerProps) {
    return (
        <Drawer open={open} variant="persistent">
            {children}
        </Drawer>
    );
}

const drawerTransition = '225ms ease-in-out';
const drawerWidth = '240px';

const Drawer = styled(MuiDrawer)(
    ({ open, theme }) => css`
        &.MuiDrawer-root {
            width: ${open ? drawerWidth : '0px'};
            transform: none;
            transition: ${drawerTransition} !important;
        }
        & .MuiPaper-root {
            width: ${open ? drawerWidth : '0px'};
            transform: none;
            transition: ${drawerTransition} !important;

            border: none;
            background-color: ${theme.palette.background.default};
        }
    `
);
