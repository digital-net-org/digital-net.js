import * as React from 'react';
import { type RouteObject } from '../Router/RouteObject';
import { EditorPage, EditorOutlet } from './Editor';
import { RootPage } from './Root';
import { LoginPage } from './Login';
import { ErrorPage } from './Error';

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
        element: <EditorOutlet />,
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
