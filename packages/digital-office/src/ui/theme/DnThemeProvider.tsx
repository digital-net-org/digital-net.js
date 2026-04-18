import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { THEME_BODY_ATTR } from './const';
import { lightTheme, darkTheme } from './config';
import { DnTheme } from './DnTheme';

/**
 * Syncs MUI theme based on system preferences.
 *
 * MUI Theme is synced with the data-theme attribute on the body element, which is set based on:
 * 1. LocalStorage value (if user has previously selected a theme)
 * 2. System preference (if no stored preference exists)
 * 3. Defaults to light theme if system preference cannot be determined
 * @param children - React children to render within the theme provider.
 */
export const DnThemeProvider = ({ children }: React.PropsWithChildren) => {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const activeTheme = React.useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

    const syncMuiTheme = React.useCallback(() => {
        const bodyTheme = DnTheme.getThemeFromBody();
        if (bodyTheme === 'dark' || bodyTheme === 'light') {
            setMode(bodyTheme);
        }
    }, []);

    React.useEffect(() => {
        DnTheme.resolveTheme();
        syncMuiTheme();

        const observer = new MutationObserver(mutations => {
            if (mutations.some(mutation => mutation.attributeName === THEME_BODY_ATTR)) {
                syncMuiTheme();
            }
        });
        observer.observe(document.body, { attributes: true });

        return () => observer.disconnect();
    }, [syncMuiTheme]);

    return (
        <ThemeProvider theme={activeTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};
