import React from 'react';
import { type SettingsViewKey, SettingsContext } from './AppSettings';

export function useDigitalApp() {
    const { navigate, open } = React.useContext(SettingsContext);

    const openAppSettings = React.useCallback((to: SettingsViewKey) => navigate(to), [navigate]);
    const isAppSettingsOpen = React.useMemo(() => open, [open]);

    return {
        openAppSettings,
        isAppSettingsOpen,
    };
}
