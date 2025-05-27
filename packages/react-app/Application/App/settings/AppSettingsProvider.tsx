import React, { type PropsWithChildren } from 'react';

export interface AppSettingsState {
    open: boolean;
    state: string | undefined;
    navigate: (state: string) => void;
    close: () => void;
}

export const AppSettingsContext = React.createContext<AppSettingsState>({
    open: false,
    state: undefined,
    navigate: () => void 0,
    close: () => void 0,
});

export function AppSettingsProvider(props: PropsWithChildren) {
    const [state, setState] = React.useState<string>();
    const [open, setOpen] = React.useState(false);

    const navigate: AppSettingsState['navigate'] = React.useCallback(
        payload => {
            setState(payload);
            if (!open) {
                setOpen(true);
            }
        },
        [open]
    );

    return <AppSettingsContext.Provider value={{ open, state, navigate, close: () => setOpen(false) }} {...props} />;
}
