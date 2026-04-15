import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { Stack, AppBar, IconButton } from '@mui/material';
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from '@mui/icons-material';
import type { DnBreadcrumbsProps } from '../DnBreadcrumbs';
import { DnBreadcrumbs } from '../DnBreadcrumbs';
import { DnMenuAccount, type DnMenuAccountProps } from '../DnMenuAccount';
import { DnMenuSettings, type DnMenuSettingsProps } from '../DnMenuSettings';
import { DnMenuTheme } from '../DnMenuTheme';

export interface DnAppBarProps {
    slots?: {
        account?: DnMenuAccountProps;
        settings?: DnMenuSettingsProps;
        menu?: { open?: boolean; onClick?: () => void };
        breadcrumbs?: DnBreadcrumbsProps;
    };
    disableSlots?: Partial<Record<'account' | 'settings' | 'theme' | 'menu' | 'breadcrumb', boolean>>;
}

export function DnAppBar({ slots, disableSlots }: DnAppBarProps) {
    return (
        <CustomAppBar disableMenu={disableSlots?.menu} elevation={0}>
            <Stack direction="row" spacing={2} alignItems="center">
                {disableSlots?.menu ? null : (
                    <IconButton size="small" color="inherit" onClick={slots?.menu?.onClick}>
                        {slots?.menu?.open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                )}
                {disableSlots?.breadcrumb ? null : <DnBreadcrumbs {...(slots?.breadcrumbs ?? {})} />}
            </Stack>
            <Stack direction="row" gap={0.5}>
                {disableSlots?.account ? null : <DnMenuAccount {...(slots?.account ?? {})} />}
                {disableSlots?.theme ? null : <DnMenuTheme />}
                {disableSlots?.settings ? null : <DnMenuSettings {...(slots?.settings ?? {})} />}
            </Stack>
        </CustomAppBar>
    );
}

const CustomAppBar = styled(AppBar, {
    shouldForwardProp: prop => prop !== 'disableMenu',
})<{ disableMenu?: boolean }>(
    ({ theme, disableMenu }) => css`
        position: relative;
        height: 2.5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: ${disableMenu ? '0 0.5rem 0 1.25rem' : '0 0.5rem'};
        color: ${theme.palette.text.primary};
        background-color: ${theme.palette.background.default};
        box-shadow: none;
    `
);
