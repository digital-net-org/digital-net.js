import * as React from 'react';
import { type UserDto } from '@digital-net-org/digital-api-sdk';

export interface UserContextValue {
    user: UserDto | null | undefined;
    isLogged: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | null>(null);

export function useDigitalNetUser(): UserContextValue {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useDigitalNetUser must be used within a UserProvider.');
    }
    return context;
}
