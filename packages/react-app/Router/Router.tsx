import React from 'react';
import { createBrowserRouter, RouterProvider as ReactRouter } from 'react-router-dom';
import { type RouteObject } from './RouteObject';
import { BuildRoute } from './RouterBuilder';
import { RouterDefault } from './RouterDefault';

export interface RouterProps {
    router: Array<RouteObject>;
}

export const RouterContext = React.createContext<RouterProps>({
    router: [],
});

export function Router({ router }: RouterProps) {
    const resolved: Array<RouteObject> = React.useMemo(() => [...router, ...RouterDefault], [router]);
    return (
        <RouterContext.Provider value={{ router: resolved }}>
            <ReactRouter router={createBrowserRouter(resolved.map(BuildRoute))} future={{ v7_startTransition: true }} />
        </RouterContext.Provider>
    );
}
