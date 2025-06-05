import * as React from 'react';
import { RootPage, LoginPage, ErrorPage, EditorPage } from '../Pages';
import { type RouteObject } from './RouteObject';
import { EditorLayout } from '../Pages/Editor/EditorLayout';

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
