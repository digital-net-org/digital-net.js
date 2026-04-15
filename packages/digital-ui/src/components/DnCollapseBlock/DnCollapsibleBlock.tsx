import * as React from 'react';
import { styled } from '@mui/material/styles';
import { type StackProps, Collapse, Stack } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

export interface DnCollapsibleBlockProps extends StackProps {
    label?: React.ReactNode;
    children?: React.ReactNode;
}

export function DnCollapsibleBlock({ children, label, ...stackProps }: DnCollapsibleBlockProps) {
    const [collapsed, setCollapsed] = React.useState<boolean>(false);

    return (
        <Stack {...stackProps}>
            <Stack
                component="button"
                onClick={() => setCollapsed(!collapsed)}
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                }}
            >
                {label}
                <ExpandMore expand={collapsed} />
            </Stack>
            <Collapse in={collapsed} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </Stack>
    );
}

const ExpandMore = styled(ExpandMoreIcon, { shouldForwardProp: prop => prop !== 'expand' })<{ expand: boolean }>(
    ({ theme, expand }) => ({
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
    })
);
