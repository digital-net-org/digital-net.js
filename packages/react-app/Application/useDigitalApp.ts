import React from 'react';
import { type settingsViews, SettingsContext } from './AppSettings';

export type SettingsViewKey = keyof (typeof settingsViews)['userViews'] | keyof (typeof settingsViews)['pagesViews'];

export function useDigitalApp() {
    const { navigate, open } = React.useContext(SettingsContext);

    const openAppSettings = React.useCallback((to: SettingsViewKey) => navigate(to), [navigate]);
    const isAppSettingsOpen = React.useMemo(() => open, [open]);

    return {
        openAppSettings,
        isAppSettingsOpen,
    };
}
