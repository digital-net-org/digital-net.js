import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouterContext } from './Router';
import { type ValidRouteObject } from './RouteObject';

export interface DigitalRoute {
    path: string;
    navigate: () => void;
    isCurrent: boolean;
    isPublic: boolean;
    displayed: boolean;
}

/**
 * Hook to manage the router.
 * @returns A tuple with the router and the current route.
 */
export function useDigitalRouter() {
    const { router: contextRouter } = React.useContext(RouterContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const validRoutes = React.useMemo(
        () =>
            (contextRouter ?? []).flatMap(({ element: _, ...route }) =>
                route.children ? route.children.map(child => ({ ...child })) : { ...route }
            ) as Array<ValidRouteObject>,
        [contextRouter]
    );

    const current: DigitalRoute | undefined = React.useMemo(() => {
        const resolved = validRoutes
            .sort((a, b) => b.path.length - a.path.length)
            .find(({ path }) => pathname.includes(path));
        return resolved?.path
            ? {
                  path: resolved.path,
                  displayed: Boolean(resolved.displayed),
                  isPublic: Boolean(resolved.isPublic),
                  isCurrent: true,
                  navigate: () => navigate(resolved.path),
              }
            : undefined;
    }, [validRoutes, pathname, navigate]);

    const router: Array<DigitalRoute> = React.useMemo(
        () =>
            validRoutes.map(({ displayed, isPublic, ...route }) => ({
                navigate: () => navigate(route.path),
                isCurrent: pathname === route.path,
                displayed: Boolean(displayed),
                isPublic: Boolean(isPublic),
                ...route,
            })),
        [validRoutes, pathname, navigate]
    );

    return { router, current };
}
