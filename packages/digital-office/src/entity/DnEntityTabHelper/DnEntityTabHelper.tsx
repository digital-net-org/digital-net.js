import * as React from 'react';
import { Alert as MuiAlert, Stack } from '@mui/material';
import { css, styled } from '@mui/material/styles';

export interface DnEntityTabHelperProps {
    description: React.ReactNode;
    children?: React.ReactNode;
}

export function DnEntityTabHelper({ children, description }: DnEntityTabHelperProps) {
    return (
        <Alert severity="info" variant="outlined">
            <Stack direction="row" sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack>{description}</Stack>
                <Stack direction="row" sx={{ gap: 2 }}>
                    {children}
                </Stack>
            </Stack>
        </Alert>
    );
}

const Alert = styled(MuiAlert)(
    () => css`
        & .MuiAlert-message {
            width: 100%;
        }
        & .MuiAlert-icon {
            padding: 0;
            align-items: center;
        }
    `
);
