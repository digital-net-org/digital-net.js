import * as React from 'react';
import type { DigitalApi } from '@digital-net-org/digital-api-sdk';
import { DnLogo, DnThemeProvider } from './ui';
import { DnApiProvider } from './api';
import { DnEntitySchemaProvider, DnEntityVariablesProvider, DnOgSchemaProvider } from './entity';
import { DigitalNetUserProvider, LayoutProvider, DnToastProvider } from './app';
import { IdbProvider } from './storage';
import { CustomRenderProvider, type DnCustomViewDict } from './custom-render';

export interface DigitalOfficeProviderProps {
    api: DigitalApi;
    children: React.ReactNode;
    appLogo?: React.ReactNode;
    customRender?: DnCustomViewDict;
}

export function DigitalOfficeProvider({ api, appLogo, customRender, children }: DigitalOfficeProviderProps) {
    return (
        <DnApiProvider api={api}>
            <DnThemeProvider>
                <DnToastProvider>
                    <DigitalNetUserProvider>
                        <IdbProvider>
                            <DnEntitySchemaProvider>
                                <DnOgSchemaProvider>
                                    <DnEntityVariablesProvider>
                                        <LayoutProvider appLogo={appLogo ?? <DnLogo />}>
                                            <CustomRenderProvider customRender={customRender}>
                                                {children}
                                            </CustomRenderProvider>
                                        </LayoutProvider>
                                    </DnEntityVariablesProvider>
                                </DnOgSchemaProvider>
                            </DnEntitySchemaProvider>
                        </IdbProvider>
                    </DigitalNetUserProvider>
                </DnToastProvider>
            </DnThemeProvider>
        </DnApiProvider>
    );
}
