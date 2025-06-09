import React from 'react';
import { createBrowserRouter, RouterProvider as ReactRouter } from 'react-router-dom';
import { type RouteObject } from './RouteObject';
import { BuildRoute } from './RouterBuilder';

export interface RouterProps {
    router: Array<RouteObject>;
}

export const RouterContext = React.createContext<RouterProps>({
    router: [],
});

export function Router({ router }: RouterProps) {
    return (
        <RouterContext.Provider value={{ router }}>
            <ReactRouter router={createBrowserRouter(router.map(BuildRoute))} future={{ v7_startTransition: true }} />
        </RouterContext.Provider>
    );
}
