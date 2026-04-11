import * as React from 'react';

export interface DnAppContextValue {
    /** The navigation panel drawer state **/
    isDrawerOpen: boolean;
    /** Toggle the state of the navigation panel drawer **/
    toggleDrawer: () => void;
    /** Set the state of the navigation panel drawer **/
    setIsDrawerOpen: (isOpen: boolean) => void;
}

const DnAppContext = React.createContext<DnAppContextValue | null>(null);

export interface DnAppProviderProps {
    children: React.ReactNode;
}

export function DnAppProvider({ children }: DnAppProviderProps) {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const toggleDrawer = React.useCallback(() => setIsDrawerOpen(!isDrawerOpen), [isDrawerOpen]);

    return (
        <DnAppContext.Provider
            value={{
                isDrawerOpen,
                toggleDrawer,
                setIsDrawerOpen,
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
