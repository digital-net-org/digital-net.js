import React from 'react';
import { AppSettingsContext } from './settings/AppSettingsProvider';

export function useDigitalApp() {
    const { navigate, open } = React.useContext(AppSettingsContext);

    const openAppSettings = React.useCallback((to: string) => navigate(to), [navigate]);
    const isAppSettingsOpen = React.useMemo(() => open, [open]);

    return {
        openAppSettings,
        isAppSettingsOpen,
    };
}
