import React from 'react';
import { Loader } from '@digital-net/react-digital-ui';

export function ClientLoader() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100vh',
            }}
        >
            <Loader size="large" />
        </div>
    );
}
