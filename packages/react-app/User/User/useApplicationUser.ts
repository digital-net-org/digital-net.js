import React from 'react';
import type { Result } from '@digital-net/core';
import { digitalClientInstance, useDigitalMutation } from '@digital-net/react-digital-client';
import { useToaster } from '../../Toaster';
import { UserContext } from './UserProvider';
import type { ApplicationUser } from './ApplicationUser';

const authApiUrl = `authentication/user`;

export function useApplicationUser(): ApplicationUser {
    const { toast } = useToaster();
    const { isLoading: isQuerying, refresh, isLogged, ...user } = React.useContext(UserContext);

    const { mutate: authenticate, isPending: loginLoading } = useDigitalMutation(`${authApiUrl}/login`, {
        onSuccess: async ({ value }: Result<string>) => {
            digitalClientInstance.setToken(value);
            toast('user:auth.success');
        },
        onError: () => toast('user:auth.error', 'error'),
        withCredentials: true,
    });

    const { mutate: logout, isPending: logoutLoading } = useDigitalMutation(`${authApiUrl}/logout`, {
        onSuccess: () => {
            digitalClientInstance.setToken(undefined);
            toast('user:auth.revoked');
        },
        onError: () => {
            digitalClientInstance.setToken(undefined);
            toast('user:auth.revoked');
        },
        withCredentials: true,
        skipRefresh: true,
    });

    const isLoading = React.useMemo(
        () => logoutLoading || loginLoading || isQuerying,
        [isQuerying, loginLoading, logoutLoading]
    );

    return {
        ...user,
        isLoading,
        isLogged,
        refresh,
        logout,
        authenticate,
    };
}
