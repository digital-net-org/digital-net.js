import * as React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { AdminGuard, AuthGuard, GuestGuard } from './guards';
import { DnAppLayout } from '../app';
import { useDnUser } from '../user';
import { APP_ROUTES, ADMIN_ROUTES, CMS_ROUTES } from './routes';
import type { DigitalOfficeRoute } from './types';

export interface DnOfficeRouterProps {
    routes?: DigitalOfficeRoute[];
}

function guardFor(route: DigitalOfficeRoute): React.ReactNode {
    if (route.isPublic) return <GuestGuard>{route.element}</GuestGuard>;
    if (route.isAdmin) return <AdminGuard>{route.element}</AdminGuard>;
    return <AuthGuard>{route.element}</AuthGuard>;
}

function RouterLayout({ allRoutes }: { allRoutes: DigitalOfficeRoute[] }) {
    const { isAdmin } = useDnUser();

    const navigation = React.useMemo(
        () =>
            allRoutes
                .filter(r => r.navGroup && r.navLabel && (!r.isAdmin || isAdmin))
                .reduce<Record<string, { path: string; label: string }[]>>((acc, curr) => {
                    const item = { path: curr.path, label: curr.navLabel! };
                    if (acc[curr.navGroup!]) acc[curr.navGroup!].push(item);
                    else acc[curr.navGroup!] = [item];
                    return acc;
                }, {}),
        [allRoutes, isAdmin]
    );

    const routePatterns = React.useMemo(() => allRoutes.map(r => r.path).filter(p => !p.includes('*')), [allRoutes]);

    return (
        <DnAppLayout navigation={navigation} routePatterns={routePatterns}>
            <Outlet />
        </DnAppLayout>
    );
}

export function DnOfficeRouter({ routes }: DnOfficeRouterProps) {
    const { isLoading } = useDnUser();

    const router = React.useMemo(() => {
        const allRoutes: DigitalOfficeRoute[] = [...APP_ROUTES, ...ADMIN_ROUTES, ...CMS_ROUTES, ...(routes ?? [])];
        return createBrowserRouter([
            {
                element: <RouterLayout allRoutes={allRoutes} />,
                children: allRoutes.map(r => ({
                    path: r.path,
                    element: guardFor(r),
                })),
            },
        ]);
    }, [routes]);

    if (isLoading) return null;

    return <RouterProvider router={router} />;
}
