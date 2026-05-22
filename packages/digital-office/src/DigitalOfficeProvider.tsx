import * as React from 'react';
import type { DigitalApi } from '@digital-net-org/digital-api-sdk';
import { DnThemeProvider } from './ui';
import { DnApiProvider } from './api';
import { DnUserProvider } from './user';
import { DnEntitySchemaProvider, DnEntityVariablesProvider, DnOgSchemaProvider } from './entity';
import { DigitalNetLogo, DnAppProvider, DnToastProvider } from './app';
import { DnIdbProvider } from './storage';
import { DnCustomRenderProvider, type DnCustomRenderFn } from './custom-render';
import { DRAFTS_DB_CONFIG } from './constants';

export interface DigitalOfficeProviderProps {
    api: DigitalApi;
    children: React.ReactNode;
    appLogo?: React.ReactNode;
    onCustomRender?: DnCustomRenderFn;
}

/**
 * Provides the dependencies and contexts for the digital-office library.
 *
 * Note: router context is provided by `DigitalOfficeRouter` (which uses
 * `createBrowserRouter` + `<RouterProvider>`), so it lives as a child
 * of these providers — none of the providers below need router hooks.
 */
export function DigitalOfficeProvider({ api, appLogo, onCustomRender, children }: DigitalOfficeProviderProps) {
    return (
        <DnApiProvider api={api}>
            <DnThemeProvider>
                <DnToastProvider>
                    <DnUserProvider>
                        <DnIdbProvider config={DRAFTS_DB_CONFIG}>
                            <DnEntitySchemaProvider>
                                <DnOgSchemaProvider>
                                    <DnEntityVariablesProvider>
                                        <DnAppProvider appLogo={appLogo ?? <DigitalNetLogo />}>
                                            <DnCustomRenderProvider onCustomRender={onCustomRender}>
                                                {children}
                                            </DnCustomRenderProvider>
                                        </DnAppProvider>
                                    </DnEntityVariablesProvider>
                                </DnOgSchemaProvider>
                            </DnEntitySchemaProvider>
                        </DnIdbProvider>
                    </DnUserProvider>
                </DnToastProvider>
            </DnThemeProvider>
        </DnApiProvider>
    );
}
