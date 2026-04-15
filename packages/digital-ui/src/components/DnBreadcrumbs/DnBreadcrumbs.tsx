import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { Box, Typography, Link, Breadcrumbs, IconButton } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

export interface BreadcrumbEntry {
    key: string;
    path: string;
}

export interface DnBreadcrumbsProps {
    url?: string;
    labels?: Record<string, string>;
    onClick?: (path: string) => void;
    onHomeClick?: () => void;
}

function parseBreadcrumbs(url: string): BreadcrumbEntry[] {
    const slugs = url.split('/').filter(Boolean);
    return slugs.map((slug, i) => ({
        key: slug,
        path: '/' + slugs.slice(0, i + 1).join('/'),
    }));
}

export function DnBreadcrumbs({ url, labels, onClick, onHomeClick }: DnBreadcrumbsProps) {
    const entries = React.useMemo(() => parseBreadcrumbs(url ?? ''), [url]);

    return (
        <CustomBreadCrumbs className="DnBreadcrumbs">
            <IconButton size="small" color="inherit" onClick={onHomeClick}>
                <HomeIcon fontSize="small" />
            </IconButton>
            {entries.map((entry, i) =>
                i < entries.length - 1 ? (
                    <Link key={entry.path} onClick={() => onClick?.(entry.path)}>
                        {labels?.[entry.key] ?? entry.key}
                    </Link>
                ) : (
                    <Typography key={entry.path} fontWeight="bold">
                        {labels?.[entry.key] ?? entry.key}
                    </Typography>
                )
            )}
        </CustomBreadCrumbs>
    );
}

const CustomBreadCrumbs = styled(Breadcrumbs)(
    () => css`
        font-weight: normal;
        letter-spacing: 0.035rem;
        user-select: none;

        & .MuiLink-root {
            text-decoration: underline;
            cursor: pointer;
            color: inherit;
        }
    `
);
