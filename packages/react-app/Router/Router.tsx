import React from 'react';
import { createBrowserRouter, RouterProvider as ReactRouter } from 'react-router-dom';
import type { RouteObject } from './RouteObject';
import { RouterDefault } from './RouterDefault';
import Route from './Route';

export interface RouterProps {
    router: Array<RouteObject>;
    renderLayout: (props: React.PropsWithChildren) => React.ReactNode;
}

export const RouterContext = React.createContext<Omit<RouterProps, 'renderLayout'>>({
    router: [],
});

export function Router({ renderLayout, router }: RouterProps) {
    const resolved = React.useMemo(() => [...router, ...RouterDefault], [router]);
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
