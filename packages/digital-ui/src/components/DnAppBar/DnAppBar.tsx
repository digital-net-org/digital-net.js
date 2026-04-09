import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { Stack, AppBar, IconButton } from '@mui/material';
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from '@mui/icons-material';
import { DnBreadcrumbs } from '../DnBreadcrumbs';
import { useClassNames } from '../useClassNames';
import { DnMenuAccount, type DnMenuAccountProps } from '../DnMenuAccount';
import { DnMenuSettings, type DnMenuSettingsProps } from '../DnMenuSettings';
import { DnMenuTheme } from '../DnMenuTheme';

export interface DnAppBarProps {
    url: string;
    slots?: {
        account?: DnMenuAccountProps;
        settings?: DnMenuSettingsProps;
        menu?: { open?: boolean; onClick?: () => void };
    };
    disableSlots?: Partial<Record<'account' | 'settings' | 'theme' | 'menu', boolean>>;
}

export function DnAppBar({ url, slots, disableSlots }: DnAppBarProps) {
    const classNames = useClassNames({ 'DnAppBar-disabled-menu': disableSlots?.menu }, [disableSlots]);

    return (
        <CustomAppBar className={`DnAppBar ${classNames}`} elevation={0}>
            <Stack direction="row" spacing={2} alignItems="center">
                {disableSlots?.menu ? null : (
                    <IconButton color="inherit" onClick={slots?.menu?.onClick}>
                        {slots?.menu?.open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                )}
                <DnBreadcrumbs url={url} />
            </Stack>
            <Stack direction="row">
                {disableSlots?.account ? null : <DnMenuAccount {...(slots?.account ?? {})} />}
                {disableSlots?.theme ? null : <DnMenuTheme />}
                {disableSlots?.settings ? null : <DnMenuSettings {...(slots?.settings ?? {})} />}
            </Stack>
        </CustomAppBar>
    );
}

const CustomAppBar = styled(AppBar)(
    ({ theme }) => css`
        position: relative;
        height: 2.5rem;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem;
        color: ${theme.palette.text.primary};
        background-color: ${theme.palette.background.default};
        box-shadow: none;

        &.DnAppBar-disabled-menu {
            padding: 0 0.5rem 0 1.25rem;
        }
    `
);
