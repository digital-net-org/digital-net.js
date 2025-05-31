import React from 'react';
import type { Result } from '@digital-net/core';
import { useDigitalMutation } from '@digital-net/react-digital-client';
import { useToaster } from '../../Toaster';
import { UserContext } from './UserProvider';
import type { ApplicationUser } from './ApplicationUser';
import { useJwt } from './useJwt';

const authApiUrl = `${DIGITAL_API_URL}/authentication/user`;

export function useApplicationUser(): ApplicationUser {
    const { toast } = useToaster();
    const [token, setToken] = useJwt();
    const { isLoading: isQuerying, refresh, ...user } = React.useContext(UserContext);

    const { mutate: authenticate, isPending: loginLoading } = useDigitalMutation(`${authApiUrl}/login`, {
        onSuccess: async ({ value }: Result<string>) => {
            setToken(value);
            toast('user:auth.success');
        },
        onError: () => toast('user:auth.error', 'error'),
        withCredentials: true,
    });

    const { mutate: logout, isPending: logoutLoading } = useDigitalMutation(`${authApiUrl}/logout`, {
        onSuccess: () => {
            setToken(undefined);
            toast('user:auth.revoked');
        },
        onError: () => {
            setToken(undefined);
            toast('user:auth.revoked');
        },
        withCredentials: true,
        skipRefresh: true,
    });

    const isLoading = React.useMemo(
        () => logoutLoading || loginLoading || isQuerying,
        [isQuerying, loginLoading, logoutLoading]
    );

    const isLogged = React.useMemo(() => token !== undefined && token !== null, [token]);

    return {
        ...user,
        isLoading,
        isLogged,
        refresh,
        logout,
        authenticate,
    };
}
