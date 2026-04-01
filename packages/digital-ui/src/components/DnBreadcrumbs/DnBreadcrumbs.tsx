import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { css, styled } from '@mui/material/styles';
import { AppBar } from '@mui/material';

export interface BreadcrumbEntry {
    key: string;
    path: string;
}

export interface DnBreadcrumbsProps {
    url: string;
    labels?: Record<string, string>;
    onClick?: (path: string) => void;
}

function parseBreadcrumbs(url: string): BreadcrumbEntry[] {
    const slugs = url.split('/').filter(Boolean);
    return slugs.map((slug, i) => ({
        key: slug,
        path: '/' + slugs.slice(0, i + 1).join('/'),
    }));
}

/**
 * Renders a breadcrumb navigation from a URL path.
 * Each slug becomes a clickable link, except the last one which is displayed as text.
 * @param url - The current URL pathname (e.g. from `useLocation().pathname`).
 * @param onClick - Called with the cumulative path when a breadcrumb link is clicked.
 */
export function DnBreadcrumbs({ url, labels, onClick }: DnBreadcrumbsProps) {
    const entries = React.useMemo(() => parseBreadcrumbs(url ?? ''), [url]);

    return (
        <CustomBreadCrumbs className="DnBreadcrumbs">
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
    ({ theme }) => css`
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
