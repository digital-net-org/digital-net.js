import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '@digital-lib/core';
import { DigitalClientProvider } from '@digital-lib/react-digital-client';
import { LocalizationMiddleware } from './Localization';
import { DigitalIdbProvider, type IDbConfig } from './IdbStorage';
import { ApplicationUserProvider, AuthMiddleware } from './User';
import { ThemeProvider } from './Theme';
import { Router, type RouterProps } from './Router';
import { ToasterProvider } from './Toaster';
import '@digital-lib/react-digital-ui/digital.net.defaults.css';
import { AppSettingsProvider } from './Application/App/settings';

interface DigitalConfig {
    strictMode?: boolean;
    idbConfig: IDbConfig;
    router?: RouterProps['router'];
}

/**
 * Utility class to create a React tree.
 */
export default class DigitalApp {
    /**
     * Creates a new instance of ReactDigital.
     * @param renderLayout - Callback that returns React element wrapping every pages.
     * @param config - Configuration object.
     * @param config.idbConfig - Indexed database configuration object
     * @param config.router - Application additional routes
     */
    public static create(renderLayout: RouterProps['renderLayout'], { strictMode, idbConfig, router }: DigitalConfig) {
        const appRoot = document.getElementById(APP_ROOT);
        if (appRoot === null) {
            throw new Error("ReactDigital: Root element not found. Please add a 'root' id to the root element");
        }

        return ReactDOM.createRoot(appRoot).render(
            React.createElement(strictMode ? React.StrictMode : React.Fragment, {
                children: (
                    <ErrorBoundary>
                        <LocalizationMiddleware />
                        <ToasterProvider>
                            <DigitalIdbProvider {...idbConfig}>
                                <DigitalClientProvider>
                                    <AuthMiddleware />
                                    <ApplicationUserProvider>
                                        <AppSettingsProvider>
                                            <ThemeProvider>
                                                <Router renderLayout={renderLayout} router={router ?? []} />
                                            </ThemeProvider>
                                        </AppSettingsProvider>
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
