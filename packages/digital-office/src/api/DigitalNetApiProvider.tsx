import * as React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { DigitalApi } from '@digital-net-org/digital-api-sdk';

const dnQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
});

const DigitalNetApiContext = React.createContext<DigitalApi | null>(null);

export function DigitalNetApiProvider({ api, children }: { api: DigitalApi; children: React.ReactNode }) {
    return (
        <DigitalNetApiContext.Provider value={api}>
            <QueryClientProvider client={dnQueryClient}>{children}</QueryClientProvider>
        </DigitalNetApiContext.Provider>
    );
}

export function useDigitalNetApi(): DigitalApi {
    const context = React.useContext(DigitalNetApiContext);
    if (!context) {
        throw new Error('useDigitalNetApi must be used within a DigitalNetApiProvider.');
    }
    return context;
}
