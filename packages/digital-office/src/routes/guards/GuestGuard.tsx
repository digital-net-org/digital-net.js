import * as React from 'react';
import { Navigate } from 'react-router';
import { useDnUser } from '../../user';
import { ROUTER_HOME_PAGE } from '../../globals';

export interface GuestGuardProps {
    children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
    const { isLogged } = useDnUser();
    if (isLogged) {
        return <Navigate to={ROUTER_HOME_PAGE} replace />;
    }
    return <React.Fragment>{children}</React.Fragment>;
}
