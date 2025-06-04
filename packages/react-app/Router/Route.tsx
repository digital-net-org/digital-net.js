import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationUser } from '../User';

export interface RouteProps extends React.PropsWithChildren {
    path: string;
    isPublic?: boolean;
}

export function Route({ children, path, isPublic }: RouteProps) {
    const navigate = useNavigate();
    const { isLogged } = useApplicationUser();

    React.useEffect(() => {
        if (!isLogged && !isPublic) {
            navigate(ROUTER_LOGIN);
        }
        if (isLogged && path === ROUTER_LOGIN) {
            navigate(ROUTER_HOME);
        }
    }, [isLogged, navigate, isPublic, path]);

    return <React.Fragment>{children}</React.Fragment>;
}
