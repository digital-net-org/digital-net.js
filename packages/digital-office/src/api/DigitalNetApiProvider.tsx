import * as React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { DigitalApi } from '@digital-net-org/digital-api-sdk';
import { dnQueryClient } from './queryClient';

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
