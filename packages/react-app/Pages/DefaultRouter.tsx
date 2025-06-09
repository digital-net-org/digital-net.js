import * as React from 'react';
import { type RouteObject } from '../Router/RouteObject';
import { EditorLayout } from './Editor/EditorLayout';
import { RootPage } from './Root/RootPage';
import { LoginPage } from './Login/LoginPage';
import { EditorPage } from './Editor/EditorPage';
import { ErrorPage } from './Error/ErrorPage';

export const DefaultRouter = [
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
        element: <EditorLayout />,
        children: [
            {
                path: ROUTER_EDITOR,
                element: <EditorPage />,
                isPublic: false,
                displayed: true,
            },
            {
                path: `${ROUTER_EDITOR}/:id`,
                element: <EditorPage />,
                isPublic: false,
                displayed: false,
            },
        ],
    },
    {
        path: '*',
        element: <ErrorPage error="404" />,
        isPublic: false,
        displayed: false,
    },
] satisfies Array<RouteObject>;
