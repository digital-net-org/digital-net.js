import * as React from 'react';
import { IconButton } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

export interface DnMenuSettingsProps {
    disabled?: boolean;
}

export function DnMenuSettings({ disabled }: DnMenuSettingsProps) {
    return (
        <IconButton color="inherit" disabled>
            <SettingsIcon />
        </IconButton>
    );
}
