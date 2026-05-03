import * as React from 'react';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { DnButton } from '../DnButton';

export interface DnExternalButtonProps {
    link: string;
    children?: React.ReactNode;
}

export function DnExternalButton({ link, children }: DnExternalButtonProps) {
    return (
        <DnButton
            variant="outlined"
            icon={<OpenInNewIcon fontSize="small" />}
            onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        >
            {children}
        </DnButton>
    );
}
