import React, { type PropsWithChildren } from 'react';
import { useLocalStorage } from '@digital-net/core';

export type ThemeOption = 'dark' | 'light';

export const ThemeContext = React.createContext({
    theme: undefined as ThemeOption | undefined,
    switchTheme: () => {
        return;
    },
});

export default function ThemeProvider(props: PropsWithChildren) {
    const [value, setValue] = useLocalStorage<ThemeOption>(
        STORAGE_KEY_THEME,
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );

    React.useEffect(() => (value ? document.documentElement.setAttribute(STORAGE_KEY_THEME, value) : void 0), [value]);

    const switchTheme = React.useCallback(() => setValue(value === 'light' ? 'dark' : 'light'), [setValue, value]);

    return <ThemeContext.Provider {...props} value={{ theme: value, switchTheme }} />;
}
