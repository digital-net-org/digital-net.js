import React from 'react';
import { type RouteObject, Application } from '@digital-net/react-app';
import { Route } from './Route';

export function BuildRoute({ element, path, isPublic, children }: RouteObject) {
    console.log({ element, path, isPublic, children });
    return {
        path,
        children: children?.map(BuildRoute),
        element: path ? (
            <Route path={path} isPublic={isPublic}>
                <Application>{element}</Application>
            </Route>
        ) : (
            element
        ),
    };
}
