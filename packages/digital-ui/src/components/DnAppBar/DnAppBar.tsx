import * as React from 'react';
import { Stack, AppBar } from '@mui/material';
import { css, styled } from '@mui/material/styles';
import { DnBreadcrumbs } from '../DnBreadcrumbs';
import { useClassNames } from '../useClassNames';

export interface DnAppBarProps {
    url: string;
    flat?: boolean;
    renderActions?: () => React.ReactNode;
}

export function DnAppBar({ flat, url, renderActions }: DnAppBarProps) {
    const classNames = useClassNames({ 'DnAppBar-Flat': flat }, [flat]);

    return (
        <CustomAppBar className={`DnAppBar ${classNames}`}>
            <DnBreadcrumbs url={url} />
            <Stack direction="row">{renderActions ? renderActions() : null}</Stack>
        </CustomAppBar>
    );
}

const CustomAppBar = styled(AppBar)(
    ({ theme }) => css`
        height: 2.5rem;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem 0 1.25rem;

        background-color: ${theme.palette.background.paper};
        color: ${theme.palette.text.primary};

        &.DnAppBar-Flat {
            box-shadow: none;
            background-color: transparent;
        }
    `
);
