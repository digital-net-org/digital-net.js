import * as React from 'react';
import type { DigitalApi } from '@digital-net-org/digital-api-sdk';
import { DnLogo, DnThemeProvider } from './ui';
import { DigitalNetApiProvider, DnMutationStreamProvider } from './api';
import { IdbProvider } from './storage';
import { DnEntitySchemaProvider, DnEntityVariablesProvider, DnOgSchemaProvider } from './entity';
import {
    DigitalNetUserProvider,
    LayoutProvider,
    ToastProvider,
    CustomRenderProvider,
    VersionProvider,
    type DnCustomViewDict,
    type DnVersion,
} from './app';

export interface DigitalOfficeProviderProps {
    api: DigitalApi;
    children: React.ReactNode;
    appLogo?: React.ReactNode;
    customRender?: DnCustomViewDict;
    version?: DnVersion;
}

export function DigitalOfficeProvider({ api, appLogo, customRender, version, children }: DigitalOfficeProviderProps) {
    return (
        <DigitalNetApiProvider api={api}>
            <DnThemeProvider>
                <ToastProvider>
                    <DigitalNetUserProvider>
                        <DnMutationStreamProvider>
                            <IdbProvider>
                                <DnEntitySchemaProvider>
                                    <DnOgSchemaProvider>
                                        <DnEntityVariablesProvider>
                                            <LayoutProvider appLogo={appLogo ?? <DnLogo />}>
                                                <VersionProvider version={version}>
                                                    <CustomRenderProvider customRender={customRender}>
                                                        {children}
                                                    </CustomRenderProvider>
                                                </VersionProvider>
                                            </LayoutProvider>
                                        </DnEntityVariablesProvider>
                                    </DnOgSchemaProvider>
                                </DnEntitySchemaProvider>
                            </IdbProvider>
                        </DnMutationStreamProvider>
                    </DigitalNetUserProvider>
                </ToastProvider>
            </DnThemeProvider>
        </DigitalNetApiProvider>
    );
}
