import * as React from 'react';
import { Navigate } from 'react-router';
import { ROUTER_LOGIN_PAGE } from '../routes';
import { useDnUser } from '../../user';

export interface AdminGuardProps {
    children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const { isLogged, isAdmin } = useDnUser();

    if (!isLogged) {
        return <Navigate to={ROUTER_LOGIN_PAGE} replace />;
    }

    if (!isAdmin) {
        return <h1>404</h1>;
    }

    return <React.Fragment>{children}</React.Fragment>;
}
