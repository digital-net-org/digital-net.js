import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '@digital-net/react-core';
import { DigitalClientInterceptors, DigitalClientProvider } from '@digital-net/react-digital-client';
import { LocalizationMiddleware } from './Localization';
import { DigitalIdbProvider } from './Storage';
import { ApplicationUserProvider } from './User';
import { ThemeProvider } from './Theme';
import { Router, type RouterProps } from './Router';
import { ToasterProvider } from './Toaster';
import { SettingsProvider, PuckConfigProvider } from './Application';

interface DigitalConfig {
    strictMode?: boolean;
    router?: RouterProps['router'];
}

/**
 * Utility class to create a React tree.
 */
export default class DigitalApp {
    /**
     * Creates a new instance of ReactDigital.
     * @param config - Configuration object.
     * @param config.router - Application additional routes
     */
    public static create({ strictMode, router }: DigitalConfig) {
        const appRoot = document.getElementById(APP_ROOT);
        if (appRoot === null) {
            throw new Error("ReactDigital: Root element not found. Please add a 'root' id to the root element");
        }

        return ReactDOM.createRoot(appRoot).render(
            React.createElement(strictMode ? React.StrictMode : React.Fragment, {
                children: (
                    <ErrorBoundary>
                        <DigitalClientInterceptors />
                        <LocalizationMiddleware />
                        <ToasterProvider>
                            <DigitalIdbProvider>
                                <DigitalClientProvider>
                                    <ApplicationUserProvider>
                                        <SettingsProvider>
                                            <PuckConfigProvider>
                                                <ThemeProvider>
                                                    <Router router={router ?? []} />
                                                </ThemeProvider>
                                            </PuckConfigProvider>
                                        </SettingsProvider>
                                    </ApplicationUserProvider>
                                </DigitalClientProvider>
                            </DigitalIdbProvider>
                        </ToasterProvider>
                    </ErrorBoundary>
                ),
            })
        );
    }
}
