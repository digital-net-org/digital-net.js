import * as React from 'react';

const DRAWER_STORAGE_KEY = 'DN_DRAWER_OPEN';

export interface DnAppContextValue {
    /** The navigation panel drawer state **/
    isDrawerOpen: boolean;
    /** Toggle the state of the navigation panel drawer **/
    toggleDrawer: () => void;
    /** Set the state of the navigation panel drawer **/
    setIsDrawerOpen: (isOpen: boolean) => void;
    /** Render the application logo **/
    AppLogo: React.ReactNode;
}

const DnAppContext = React.createContext<DnAppContextValue | null>(null);

export interface DnAppProviderProps {
    appLogo: React.ReactNode;
    children: React.ReactNode;
}

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

export function DnAppProvider({ children, appLogo }: DnAppProviderProps) {
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
        <DnAppContext.Provider
            value={{
                isDrawerOpen,
                toggleDrawer,
                setIsDrawerOpen,
                AppLogo: appLogo,
            }}
        >
            {children}
        </DnAppContext.Provider>
    );
}

export function useDnApp(): DnAppContextValue {
    const context = React.useContext(DnAppContext);
    if (!context) {
        throw new Error('useDnUser must be used within a DnUserProvider.');
    }
    return context;
}
