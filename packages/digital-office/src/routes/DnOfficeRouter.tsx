import * as React from 'react';
import { Routes, Route } from 'react-router';
import { AuthGuard, GuestGuard } from './guards';
import { ROUTER_HOME_PAGE, ROUTER_LOGIN_PAGE } from '../globals';
import { useMemo } from 'react';
import { DnAppLayout } from '../app';
import { LoginView } from '../views/login/LoginView';

export interface DigitalOfficeRoute {
    path: string;
    navGroup: string;
    navLabel: string;
    element: React.ReactNode;
    isPublic?: boolean;
}

export interface DnOfficeRouterProps {
    routes?: DigitalOfficeRoute[];
}

export function DnOfficeRouter({ routes }: DnOfficeRouterProps) {
    const resolvedRoutes = useMemo(
        () => [
            {
                path: ROUTER_HOME_PAGE,
                element: <h1>Home</h1>,
            },
            {
                path: ROUTER_LOGIN_PAGE,
                isPublic: true,
                element: <LoginView />,
            },
            ...(routes ?? []),
        ],
        [routes]
    );

    return (
        <DnAppLayout navigation={{}}>
            <Routes>
                {resolvedRoutes.map(({ element, isPublic, path }) => (
                    <Route
                        key={path}
                        path={path}
                        element={isPublic ? <GuestGuard>{element}</GuestGuard> : <AuthGuard>{element}</AuthGuard>}
                    />
                ))}
            </Routes>
        </DnAppLayout>
    );
}
