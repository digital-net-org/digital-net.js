import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserDto } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../api';

const USER_QUERY_KEY = ['dn-user', 'self'] as const;

export interface DnUserContextValue {
    /** The currently authenticated user, or `null` when not logged in. */
    user: UserDto | null | undefined;
    /** `true` when a valid session exists and the user profile has been fetched. */
    isLogged: boolean;
    /** `true` when the authenticated user has admin privileges. */
    isAdmin: boolean;
    /** `true` during initial session restoration or while the user profile is loading. */
    isLoading: boolean;
    /** Force a refetch of the current user profile. */
    refresh: () => Promise<void>;
    /** Logout the current user **/
    logout: () => Promise<void>;
}

const DnUserContext = React.createContext<DnUserContextValue | null>(null);

export interface DnUserProviderProps {
    children: React.ReactNode;
}

export function DnUserProvider({ children }: DnUserProviderProps) {
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

    const { data: isAdminData } = useQuery<boolean>({
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
        () => (hasToken && isQueryLoading) || isLogoutLoading,
        [hasToken, isLogoutLoading, isQueryLoading]
    );
    const user = React.useMemo(() => (isLogged ? userData : null), [isLogged, userData]);

    const refresh = React.useCallback(
        () => queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY] }),
        [queryClient]
    );

    return (
        <DnUserContext.Provider
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
        </DnUserContext.Provider>
    );
}

export function useDnUser(): DnUserContextValue {
    const context = React.useContext(DnUserContext);
    if (!context) {
        throw new Error('useDnUser must be used within a DnUserProvider.');
    }
    return context;
}
