import React, { type PropsWithChildren } from 'react';
import { type views } from './AppSettings';

export type SettingsViewKey = keyof (typeof views)['user'];

export interface SettingsState {
    open: boolean;
    state: string | undefined;
    navigate: (state: string) => void;
    close: () => void;
}

export const SettingsContext = React.createContext<SettingsState>({
    open: false,
    state: undefined,
    navigate: () => void 0,
    close: () => void 0,
});

export function SettingsProvider(props: PropsWithChildren) {
    const [state, setState] = React.useState<string>();
    const [open, setOpen] = React.useState(false);

    const navigate: SettingsState['navigate'] = React.useCallback(
        payload => {
            setState(payload);
            if (!open) {
                setOpen(true);
            }
        },
        [open]
    );

    return <SettingsContext.Provider value={{ open, state, navigate, close: () => setOpen(false) }} {...props} />;
}
