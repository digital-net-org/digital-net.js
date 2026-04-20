import * as React from 'react';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { DnIconButton } from '../DnIconButton';

export interface DnMenuSettingsProps {
    disabled?: boolean;
}

export function DnMenuSettings({ disabled: _disabled }: DnMenuSettingsProps) {
    return (
        <DnIconButton disabled>
            <SettingsIcon />
        </DnIconButton>
    );
}
