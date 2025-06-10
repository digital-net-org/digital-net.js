import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDigitalClientState } from '@digital-net/react-digital-client';

export interface RouteProps extends React.PropsWithChildren {
    path: string;
    isPublic?: boolean;
}

export function Route({ children, path, isPublic }: RouteProps) {
    const navigate = useNavigate();
    const { isInitialized, token } = useDigitalClientState();

    React.useEffect(() => {
        if (!isInitialized) {
            return;
        }
        if (!token && !isPublic) {
            navigate(ROUTER_LOGIN);
        }
        if (token && path === ROUTER_LOGIN) {
            navigate(ROUTER_HOME);
        }
    }, [navigate, isPublic, path, isInitialized, token]);

    return <React.Fragment>{children}</React.Fragment>;
}
