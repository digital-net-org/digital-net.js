import React from 'react';
import { type EntityRaw, type Result, EntityHelper, type User } from '@digital-net/core';
import { digitalClientInstance, useDigitalQuery } from '@digital-net/react-digital-client';

import { useToaster } from '../../Toaster';
import { useJwt } from './useJwt';

interface ApplicationUserContextState extends User {
    isLoading: boolean;
    isLogged: boolean;
    refresh: () => void;
}

const defaultState = {
    isLoading: false,
    refresh: () => void 0,
    username: '',
    login: '',
    email: '',
    isActive: false,
    isLogged: false,
    id: '',
    createdAt: new Date(),
    updatedAt: undefined,
};

export const UserContext = React.createContext<ApplicationUserContextState>(defaultState);

export function ApplicationUserProvider({ children }: React.PropsWithChildren) {
    const { toast } = useToaster();
    const token = useJwt();

    const {
        data: userData,
        isLoading,
        refetch: refresh,
    } = useDigitalQuery<Result<EntityRaw>>('user/self', {
        onError: () => toast('global:errors.unhandled', 'error'),
        enabled: !!token,
    });

    const user = React.useMemo(
        () => (userData?.value ? EntityHelper.build<User>(userData.value) : defaultState),
        [userData]
    );

    React.useEffect(() => (token !== undefined ? digitalClientInstance.invalidate('user/self') : void 0), [token]);

    const isLogged = React.useMemo(() => token !== undefined && token !== null, [token]);

    return <UserContext.Provider value={{ isLoading, isLogged, refresh, ...user }}>{children}</UserContext.Provider>;
}
