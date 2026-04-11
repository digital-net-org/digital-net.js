import * as React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { DigitalApi } from '@digital-net-org/digital-api-sdk';
import { dnQueryClient } from './dnQueryClient';

const DnApiContext = React.createContext<DigitalApi | null>(null);

export interface DnApiProviderProps {
    api: DigitalApi;
    children: React.ReactNode;
}

export function DnApiProvider({ api, children }: DnApiProviderProps) {
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
