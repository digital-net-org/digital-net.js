import React from 'react';
import { Button, Icon } from '../../../react-digital-ui';
import useTheme from '../useTheme';

export default function ThemeSwitch() {
    const { theme, switchTheme } = useTheme();
    return (
        <Button variant="icon" value={theme} onClick={switchTheme}>
            {theme === 'dark' ? <Icon.ThemeMoonIcon variant="filled" /> : <Icon.ThemeSunIcon variant="filled" />}
        </Button>
    );
}
