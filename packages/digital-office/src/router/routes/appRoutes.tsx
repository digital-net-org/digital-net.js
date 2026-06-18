import * as React from 'react';
import { ROUTER_HOME_PAGE, ROUTER_LOGIN_PAGE } from './routes';
import type { DigitalOfficeRoute } from '../types';
import { HomeView, LoginView, NotFoundView } from '../../app';

export const APP_ROUTES: DigitalOfficeRoute[] = [
    {
        path: ROUTER_HOME_PAGE,
        element: <HomeView />,
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
