import React from 'react';
import { digitalClientInstance } from '@digital-net/react-digital-client';

export function DigitalClientInterceptors() {
    React.useEffect(() => {
        digitalClientInstance.mountInterceptors();
        return () => digitalClientInstance.disposeInterceptors();
    }, []);

    return <React.Fragment />;
}
