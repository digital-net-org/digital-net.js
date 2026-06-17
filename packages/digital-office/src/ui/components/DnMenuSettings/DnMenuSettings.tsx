import * as React from 'react';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { DnIconButton } from '../DnIconButton';

export interface DnMenuSettingsProps {
    onClick: () => void;
}

export function DnMenuSettings({ onClick }: DnMenuSettingsProps) {
    return (
        <DnIconButton>
            <SettingsIcon onClick={onClick} />
        </DnIconButton>
    );
}
