import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { Typography, Link, Breadcrumbs, IconButton } from '@mui/material';
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
    isPathClickable?: (path: string) => boolean;
}

function parseBreadcrumbs(url: string): BreadcrumbEntry[] {
    const slugs = url.split('/').filter(Boolean);
    return slugs.map((slug, i) => ({
        key: slug,
        path: '/' + slugs.slice(0, i + 1).join('/'),
    }));
}

export function DnBreadcrumbs({ url, labels, onClick, onHomeClick, isPathClickable }: DnBreadcrumbsProps) {
    const entries = React.useMemo(() => parseBreadcrumbs(url ?? ''), [url]);

    return (
        <CustomBreadCrumbs className="DnBreadcrumbs">
            <IconButton size="small" color="inherit" onClick={onHomeClick}>
                <HomeIcon fontSize="small" />
            </IconButton>
            {entries.map((entry, i) => {
                const label = labels?.[entry.key] ?? entry.key;
                if (i === entries.length - 1) {
                    return (
                        <Typography key={entry.path} fontWeight="bold">
                            {label}
                        </Typography>
                    );
                }
                return (isPathClickable?.(entry.path) ?? true) ? (
                    <Link key={entry.path} onClick={() => onClick?.(entry.path)}>
                        {label}
                    </Link>
                ) : (
                    <Typography key={entry.path}>{label}</Typography>
                );
            })}
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
