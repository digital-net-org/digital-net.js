import React from 'react';
import { createRoot } from 'react-dom/client';
import { DigitalError } from '@digital-net-org/digital-core';
import type { CreateReactAppOptions } from './types';

export class ReactApp {
    public static create(payload: CreateReactAppOptions) {
        const body = document.querySelector('body');
        if (!body) {
            throw new DigitalError(
                'Body element not found. Please ensure the document has a body element',
                'ReactApp.create'
            );
        }
        const appRoot = document.createElement('div');
        appRoot.id = 'root';
        body.appendChild(appRoot);

        return createRoot(appRoot).render(
            React.createElement(payload?.strictMode ? React.StrictMode : React.Fragment, {
                children: payload.render(),
            })
        );
    }
}
