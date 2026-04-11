import * as React from 'react';
import { Navigate } from 'react-router';
import { useDnUser } from '../../user';
import { ROUTER_LOGIN_PAGE } from '../../globals';

export interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isLogged } = useDnUser();
    if (!isLogged) {
        return <Navigate to={ROUTER_LOGIN_PAGE} replace />;
    }
    return <React.Fragment>{children}</React.Fragment>;
}
