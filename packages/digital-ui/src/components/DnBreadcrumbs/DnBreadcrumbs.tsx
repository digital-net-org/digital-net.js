import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

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
        <Breadcrumbs className="DnBreadcrumbs">
            {entries.map((entry, i) =>
                i < entries.length - 1 ? (
                    <Link
                        key={entry.path}
                        underline="hover"
                        color="inherit"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => onClick?.(entry.path)}
                    >
                        {labels?.[entry.key] ?? entry.key}
                    </Link>
                ) : (
                    <Typography key={entry.path} color="text.primary" sx={{ userSelect: 'none' }}>
                        {labels?.[entry.key] ?? entry.key}
                    </Typography>
                )
            )}
        </Breadcrumbs>
    );
}
