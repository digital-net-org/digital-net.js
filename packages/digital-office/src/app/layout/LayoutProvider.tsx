import * as React from 'react';

const DRAWER_STORAGE_KEY = 'DN_DRAWER_OPEN';

interface LayoutContextValue {
    isDrawerOpen: boolean;
    toggleDrawer: () => void;
    setIsDrawerOpen: (_isOpen: boolean) => void;
    AppLogo: React.ReactNode;
}

const LayoutContext = React.createContext<LayoutContextValue | null>(null);

function readDrawerOpen(): boolean {
    try {
        return window.localStorage.getItem(DRAWER_STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
}

function writeDrawerOpen(value: boolean) {
    try {
        window.localStorage.setItem(DRAWER_STORAGE_KEY, String(value));
    } catch {}
}

export function LayoutProvider({ children, appLogo }: { appLogo: React.ReactNode; children: React.ReactNode }) {
    const [isDrawerOpen, setIsDrawerOpenState] = React.useState<boolean>(readDrawerOpen);

    const setIsDrawerOpen = React.useCallback((next: boolean) => {
        setIsDrawerOpenState(next);
        writeDrawerOpen(next);
    }, []);

    const toggleDrawer = React.useCallback(() => {
        setIsDrawerOpenState(prev => {
            const next = !prev;
            writeDrawerOpen(next);
            return next;
        });
    }, []);

    return (
        <LayoutContext.Provider
            value={{
                isDrawerOpen,
                toggleDrawer,
                setIsDrawerOpen,
                AppLogo: appLogo,
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout(): LayoutContextValue {
    const context = React.useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider.');
    }
    return context;
}
