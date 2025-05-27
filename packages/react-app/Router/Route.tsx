import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJwt } from '../User';

export interface RouteProps extends React.PropsWithChildren {
    path: string;
    isPublic?: boolean;
}

export default function Route({ children, path, isPublic }: RouteProps) {
    const navigate = useNavigate();
    const [token] = useJwt();

    React.useEffect(() => {
        if (!token && !isPublic) {
            navigate(ROUTER_LOGIN);
        }
        if (token && path === ROUTER_LOGIN) {
            navigate(ROUTER_HOME);
        }
    }, [token, navigate, isPublic, path]);

    return <React.Fragment>{children}</React.Fragment>;
}
