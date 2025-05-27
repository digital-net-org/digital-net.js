import React from 'react';
import { createBrowserRouter, RouterProvider as ReactRouter } from 'react-router-dom';
import RouterBuilder from './builder/RouterBuilder';
import type { RouteObject } from './RouteObject';
import DefaultRouter from './DefaultRouter';
import Route from './Route';

export interface RouterProps {
    router: Array<RouteObject>;
    renderLayout: (props: React.PropsWithChildren) => React.ReactNode;
}

export const RouterContext = React.createContext<Omit<RouterProps, 'renderLayout'>>({
    router: [],
});

export function Router({ renderLayout, router }: RouterProps) {
    const resolved = React.useMemo(() => [...router, ...RouterBuilder.build(), ...DefaultRouter], [router]);
    return (
        <RouterContext.Provider value={{ router: resolved }}>
            <ReactRouter
                router={createBrowserRouter(
                    resolved.map(({ element: children, path, isPublic }) => ({
                        path,
                        element: (
                            <Route path={path} isPublic={isPublic}>
                                {renderLayout({ children })}
                            </Route>
                        ),
                    }))
                )}
                future={{
                    v7_startTransition: true,
                }}
            />
        </RouterContext.Provider>
    );
}
