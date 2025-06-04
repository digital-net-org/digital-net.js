import React from 'react';
import { LocalStorage } from '@digital-net/core';
import { digitalClientInstance } from '@digital-net/react-digital-client';

export function useJwt() {
    const [token, setToken] = React.useState<string | undefined>(LocalStorage.get<string>(STORAGE_KEY_AUTH));

    React.useEffect(() => {
        const unsubscribe = digitalClientInstance.onTokenChange(token => {
            setToken(token);

            if (token === undefined) {
                LocalStorage.remove(STORAGE_KEY_AUTH);
            } else {
                LocalStorage.set(STORAGE_KEY_AUTH, token);
            }
        });
        return unsubscribe;
    }, []);

    return token;
}
