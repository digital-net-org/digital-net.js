import * as React from 'react';

export interface LayoutContextValue {
    isDrawerOpen: boolean;
    toggleDrawer: () => void;
    setIsDrawerOpen: (_isOpen: boolean) => void;
    AppLogo: React.ReactNode;
}
export const LayoutContext = React.createContext<LayoutContextValue | null>(null);

export function useLayout(): LayoutContextValue {
    const context = React.useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider.');
    }
    return context;
}
