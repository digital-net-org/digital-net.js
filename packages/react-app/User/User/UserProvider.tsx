import React from 'react';
import { type EntityRaw, type Result, EntityHelper, type User } from '@digital-net/core';
import { DigitalReactClient, useDigitalQuery } from '@digital-net/react-digital-client';

import { useToaster } from '../../Toaster';
import { useJwt } from './useJwt';

interface ApplicationUserContextState extends User {
    isLoading: boolean;
    refresh: () => void;
}

const defaultState = {
    isLoading: false,
    refresh: () => void 0,
    username: '',
    login: '',
    email: '',
    isActive: false,
    id: '',
    createdAt: new Date(),
    updatedAt: undefined,
};

export const UserContext = React.createContext<ApplicationUserContextState>(defaultState);

export function ApplicationUserProvider({ children }: React.PropsWithChildren) {
    const { toast } = useToaster();
    const [token, _] = useJwt();
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

    React.useEffect(() => (token !== undefined ? DigitalReactClient.invalidate('user/self') : void 0), [token]);

    return <UserContext.Provider value={{ isLoading, refresh, ...user }}>{children}</UserContext.Provider>;
}
