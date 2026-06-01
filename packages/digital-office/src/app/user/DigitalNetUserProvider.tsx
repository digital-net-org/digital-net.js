import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type UserDto } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../api';

const USER_QUERY_KEY = ['dn-user', 'self'] as const;

interface UserContextValue {
    user: UserDto | null | undefined;
    isLogged: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = React.createContext<UserContextValue | null>(null);

export function DigitalNetUserProvider({ children }: React.PropsWithChildren) {
    const api = useDnApi();
    const queryClient = useQueryClient();

    const [hasToken, setHasToken] = React.useState(() => api.http.getToken() != null);

    React.useEffect(() => {
        const unsubscribe = api.http.subscribeTokenChangeEvent(token => {
            setHasToken(token != null);
            if (token == null) {
                queryClient.setQueryData(USER_QUERY_KEY, null);
                queryClient.setQueryData([...USER_QUERY_KEY, 'is-admin'], false);
            } else {
                (async () => await queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY] }))();
            }
        });
        return unsubscribe;
    }, [api, queryClient]);

    const { data: userData, isLoading: isQueryLoading } = useQuery<UserDto | null>({
        queryKey: [...USER_QUERY_KEY],
        queryFn: async () => {
            const result = await api.catalog.user.getSelf();
            return result.hasError ? null : result.value;
        },
        enabled: hasToken,
    });

    const { data: isAdminData, isLoading: isAdminQueryLoading } = useQuery<boolean>({
        queryKey: [...USER_QUERY_KEY, 'is-admin'],
        queryFn: async () => {
            const result = await api.catalog.user.isSelfAdmin();
            return !result.hasError && result.value;
        },
        enabled: hasToken && userData != null,
    });

    const { mutateAsync: logout, isPending: isLogoutLoading } = useMutation({
        mutationFn: async () => {
            await api.catalog.auth.logout({
                onError: () => api.http.clearToken(),
                onResponse: () => setHasToken(false),
            });
        },
    });

    const isLogged = React.useMemo<boolean>(() => hasToken && userData != null, [userData, hasToken]);
    const isAdmin = React.useMemo<boolean>(() => isLogged && isAdminData === true, [isLogged, isAdminData]);
    const isLoading = React.useMemo<boolean>(
        () => (hasToken && (isQueryLoading || (userData != null && isAdminQueryLoading))) || isLogoutLoading,
        [hasToken, isLogoutLoading, isQueryLoading, userData, isAdminQueryLoading]
    );
    const user = React.useMemo(() => (isLogged ? userData : null), [isLogged, userData]);

    const refresh = React.useCallback(
        () => queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY] }),
        [queryClient]
    );

    return (
        <UserContext.Provider
            value={{
                user,
                isLoading,
                isLogged,
                isAdmin,
                refresh,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useDigitalNetUser(): UserContextValue {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useDigitalNetUser must be used within a UserProvider.');
    }
    return context;
}
