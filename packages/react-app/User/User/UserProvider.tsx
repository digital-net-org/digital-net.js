import React from 'react';
import { type EntityRaw, type Result, EntityHelper, type User } from '@digital-net/dto';
import { useDigitalQuery } from '@digital-net/react-digital-client';
import { DigitalClient } from '@digital-net/core';
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

const getSelfUrl = `${DIGITAL_API_URL}/user/self`;

export function ApplicationUserProvider({ children }: React.PropsWithChildren) {
    const { toast } = useToaster();
    const [token, _] = useJwt();
    const {
        data: userData,
        isLoading,
        refetch: refresh,
    } = useDigitalQuery<Result<EntityRaw>>(!token ? undefined : getSelfUrl, {
        onError: () => toast('global:errors.unhandled', 'error'),
    });

    const user = React.useMemo(
        () => (userData?.value ? EntityHelper.build<User>(userData.value) : defaultState),
        [userData]
    );

    React.useEffect(() => (token !== undefined ? DigitalClient.invalidate(getSelfUrl) : void 0), [token]);

    return <UserContext.Provider value={{ isLoading, refresh, ...user }}>{children}</UserContext.Provider>;
}
