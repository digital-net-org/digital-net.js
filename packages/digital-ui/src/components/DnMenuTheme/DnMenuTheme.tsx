import * as React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { LightMode as LightIcon, DarkMode as DarkIcon } from '@mui/icons-material';
import { DnTheme } from '../../theme';

export function DnMenuTheme() {
    const theme = useTheme();
    const resolvedThemeIcon = React.useMemo(
        () => ({ light: <DarkIcon />, dark: <LightIcon /> })[theme.palette.mode],
        [theme.palette.mode]
    );

    if (!resolvedThemeIcon) {
        return null;
    }

    return (
        <IconButton color="inherit" onClick={DnTheme.toggleTheme}>
            {resolvedThemeIcon}
        </IconButton>
    );
}
