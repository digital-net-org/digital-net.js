import * as React from 'react';
import { ErrorView, LoginView } from '../Application';
import { RootPage } from '../Pages';
import { type RouteObject } from './RouteObject';

export const RouterDefault = [
    {
        path: '/',
        element: <RootPage />,
        isPublic: true,
        displayed: false,
    },
    {
        path: '/login',
        element: <LoginView />,
        isPublic: true,
        displayed: false,
    },
    {
        path: '*',
        element: <ErrorView error="404" />,
        isPublic: false,
        displayed: false,
    },
] satisfies Array<RouteObject>;
