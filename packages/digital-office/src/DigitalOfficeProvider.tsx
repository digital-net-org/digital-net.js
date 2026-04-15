import * as React from 'react';
import { BrowserRouter } from 'react-router';
import type { DigitalApi } from '@digital-net-org/digital-api-sdk';
import { DnThemeProvider } from '@digital-net-org/digital-ui';
import { DnApiProvider } from './api';
import { DnUserProvider } from './user';
import { DigitalNetLogo, DnAppProvider, DnToastProvider } from './app';

export interface DigitalOfficeProviderProps {
    api: DigitalApi;
    children: React.ReactNode;
    appLogo?: React.ReactNode;
}

/**
 * Provides the dependencies and contexts for the digital-office library.
 */
export function DigitalOfficeProvider({ api, appLogo, children }: DigitalOfficeProviderProps) {
    return (
        <DnApiProvider api={api}>
            <DnThemeProvider>
                <BrowserRouter>
                    <DnToastProvider>
                        <DnUserProvider>
                            <DnAppProvider appLogo={appLogo ?? <DigitalNetLogo />}>{children}</DnAppProvider>
                        </DnUserProvider>
                    </DnToastProvider>
                </BrowserRouter>
            </DnThemeProvider>
        </DnApiProvider>
    );
}
