import * as React from 'react';
import { Routes, Route } from 'react-router';
import { AdminGuard, AuthGuard, GuestGuard } from './guards';
import { DnAppLayout } from '../app';
import { useDnUser } from '../user';
import { APP_ROUTES, ADMIN_ROUTES, CMS_ROUTES } from './routes';
import type { DigitalOfficeRoute } from './types';

export interface DnOfficeRouterProps {
    routes?: DigitalOfficeRoute[];
}

export function DnOfficeRouter({ routes }: DnOfficeRouterProps) {
    const { isAdmin, isLoading } = useDnUser();

    const resolvedRoutes = React.useMemo<DigitalOfficeRoute[]>(
        () => [...APP_ROUTES, ...ADMIN_ROUTES, ...CMS_ROUTES, ...(routes ?? [])],
        [routes]
    );

    const routePatterns = React.useMemo(
        () => resolvedRoutes.map(r => r.path).filter(p => !p.includes('*')),
        [resolvedRoutes]
    );

    const resolvedNavigation = React.useMemo(
        () => ({
            ...resolvedRoutes
                .filter(r => r.navGroup && r.navLabel && (!r.isAdmin || isAdmin))
                .reduce<Record<string, { path: string; label: string }[]>>((acc, curr) => {
                    const item = { path: curr.path, label: curr.navLabel! };
                    if (acc[curr.navGroup!]) {
                        acc[curr.navGroup!].push(item);
                    } else {
                        acc[curr.navGroup!] = [item];
                    }
                    return acc;
                }, {}),
        }),
        [resolvedRoutes, isAdmin]
    );

    if (isLoading) return null;

    return (
        <DnAppLayout navigation={resolvedNavigation} routePatterns={routePatterns}>
            <Routes>
                {resolvedRoutes.map(({ element, isPublic, isAdmin: admin, path }) => {
                    let guarded: React.ReactNode;
                    if (isPublic) {
                        guarded = <GuestGuard>{element}</GuestGuard>;
                    } else if (admin) {
                        guarded = <AdminGuard>{element}</AdminGuard>;
                    } else {
                        guarded = <AuthGuard>{element}</AuthGuard>;
                    }
                    return <Route key={path} path={path} element={guarded} />;
                })}
            </Routes>
        </DnAppLayout>
    );
}
