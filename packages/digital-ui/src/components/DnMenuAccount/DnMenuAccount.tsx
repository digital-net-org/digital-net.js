import * as React from 'react';
import { IconButton } from '@mui/material';
import { AccountCircle as AccountIcon } from '@mui/icons-material';

export interface DnMenuAccountProps {
    imgSrc?: string;
    disabled?: boolean;
}

export function DnMenuAccount({ imgSrc, ...IconButtonProps }: DnMenuAccountProps) {
    return (
        <IconButton color="inherit" {...IconButtonProps}>
            <AccountIcon />
        </IconButton>
    );
}
