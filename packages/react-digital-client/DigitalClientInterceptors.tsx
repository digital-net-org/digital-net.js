import React from 'react';
import { digitalClientInstance } from '@digital-net/react-digital-client';
import { LocalStorage } from '@digital-net/core';

export function DigitalClientInterceptors() {
    React.useEffect(() => {
        digitalClientInstance.setToken(LocalStorage.get<string>(STORAGE_KEY_AUTH));
        digitalClientInstance.mountInterceptors();
        return () => digitalClientInstance.disposeInterceptors();
    }, []);

    return <React.Fragment />;
}
