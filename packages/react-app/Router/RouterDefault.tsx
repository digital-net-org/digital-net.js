import * as React from 'react';
import { RootPage, LoginPage, ErrorPage, EditorPage } from '../Pages';
import { type RouteObject } from './RouteObject';

export const RouterDefault = [
    {
        path: ROUTER_HOME,
        element: <RootPage />,
        isPublic: false,
        displayed: false,
    },
    {
        path: ROUTER_LOGIN,
        element: <LoginPage />,
        isPublic: true,
        displayed: false,
    },
    {
        path: ROUTER_EDITOR,
        element: <EditorPage />,
        isPublic: false,
        displayed: true,
    },
    {
        path: '*',
        element: <ErrorPage error="404" />,
        isPublic: false,
        displayed: false,
    },
] satisfies Array<RouteObject>;
