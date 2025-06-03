import React from 'react';
import { digitalClientInstance } from '@digital-net/react-digital-client';
import { useJwt } from './User';

export default function AuthMiddleware() {
    const [token, setToken] = useJwt();

    React.useEffect(() => {
        digitalClientInstance.setToken(token);
    }, [token]);

    React.useEffect(() => {
        digitalClientInstance.mountInterceptors();
        return () => digitalClientInstance.dispose();
    }, []);

    return <React.Fragment />;
}
