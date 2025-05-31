import * as React from 'react';
import { RootPage, LoginPage, ErrorPage } from '../Pages';
import { type RouteObject } from './RouteObject';

export const RouterDefault = [
    {
        path: '/',
        element: <RootPage />,
        isPublic: false,
        displayed: false,
    },
    {
        path: '/login',
        element: <LoginPage />,
        isPublic: true,
        displayed: false,
    },
    {
        path: '*',
        element: <ErrorPage error="404" />,
        isPublic: false,
        displayed: false,
    },
] satisfies Array<RouteObject>;
