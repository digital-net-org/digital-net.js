import * as React from 'react';
import { Box } from '@mui/material';

export function LexicalRoot({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                '& strong, & .bold': { fontWeight: 700 },
                '& em, & .italic': { fontStyle: 'italic' },
                '& u, & .underline': { textDecoration: 'underline' },
                '& s, & .strikethrough': { textDecoration: 'line-through' },
                '& blockquote': {
                    borderLeft: '4px solid',
                    borderColor: 'divider',
                    pl: 2,
                    ml: 0,
                    fontStyle: 'italic',
                },
                '& h1, & .title-1': { fontSize: '1.75rem', my: 1.5, fontWeight: 600 },
                '& h2, & .title-2': { fontSize: '1.5rem', my: 1.25, fontWeight: 600 },
                '& h3, & .title-3': { fontSize: '1.25rem', my: 1, fontWeight: 600 },
                '& h4, & .title-4': { fontSize: '1.1rem', my: 0.75, fontWeight: 600 },
                '& ul, & ol, & .list, & .list-numbered': { pl: 4, my: 1 },
                '& p, & .paragraph': { my: 0.5 },
                '& a, & .link': { color: 'primary.main', textDecoration: 'underline' },
            }}
        >
            {children}
        </Box>
    );
}
