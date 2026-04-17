import * as React from 'react';
import { ROUTER_HOME_PAGE, ROUTER_LOGIN_PAGE } from './routes';
import type { DigitalOfficeRoute } from '../types';
import { LoginView, NotFoundView } from '../../app';

export const APP_ROUTES: DigitalOfficeRoute[] = [
    {
        path: ROUTER_HOME_PAGE,
        element: <h1>Home</h1>,
    },
    {
        path: ROUTER_LOGIN_PAGE,
        isPublic: true,
        element: <LoginView />,
    },
    {
        path: '*',
        element: <NotFoundView />,
    },
];
