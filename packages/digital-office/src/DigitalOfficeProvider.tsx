import * as React from 'react';
import { BrowserRouter } from 'react-router';
import type { DigitalApi } from '@digital-net-org/digital-api-sdk';
import { DnThemeProvider } from '@digital-net-org/digital-ui';
import { DnApiProvider } from './api';
import { DnUserProvider } from './user';
import { DnAppProvider, DnToastProvider } from './app';

export interface DigitalOfficeProviderProps {
    api: DigitalApi;
    children: React.ReactNode;
}

/**
 * Provides the dependencies and contexts for the digital-office library.
 */
export function DigitalOfficeProvider({ api, children }: DigitalOfficeProviderProps) {
    return (
        <DnApiProvider api={api}>
            <DnThemeProvider>
                <BrowserRouter>
                    <DnToastProvider>
                        <DnUserProvider>
                            <DnAppProvider>{children}</DnAppProvider>
                        </DnUserProvider>
                    </DnToastProvider>
                </BrowserRouter>
            </DnThemeProvider>
        </DnApiProvider>
    );
}
