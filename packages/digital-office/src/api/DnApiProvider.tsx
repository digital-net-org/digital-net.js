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

const DnApiContext = React.createContext<DigitalApi | null>(null);

export function DnApiProvider({ api, children }: { api: DigitalApi; children: React.ReactNode }) {
    return (
        <DnApiContext.Provider value={api}>
            <QueryClientProvider client={dnQueryClient}>{children}</QueryClientProvider>
        </DnApiContext.Provider>
    );
}

export function useDnApi(): DigitalApi {
    const context = React.useContext(DnApiContext);
    if (!context) {
        throw new Error('useDnApi must be used within a DnApiProvider.');
    }
    return context;
}
