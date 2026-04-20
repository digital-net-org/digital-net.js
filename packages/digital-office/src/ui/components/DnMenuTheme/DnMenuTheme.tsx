import * as React from 'react';
import { useTheme } from '@mui/material';
import { LightMode as LightIcon, DarkMode as DarkIcon } from '@mui/icons-material';
import { DnIconButton } from '../DnIconButton';
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

    return <DnIconButton onClick={DnTheme.toggleTheme}>{resolvedThemeIcon}</DnIconButton>;
}
