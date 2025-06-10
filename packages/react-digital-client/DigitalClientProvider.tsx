import React, { type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ClientLoader } from './ClientLoader';
import { digitalClientInstance } from './digitalClientInstance';
import { delay } from '@digital-net/core';

const DigitalClientContext = React.createContext<{
    token: string | undefined;
    isInitialized: boolean;
}>({ token: undefined, isInitialized: false });

export function DigitalClientProvider(props: PropsWithChildren) {
    const [isInitialized, setIsInitialized] = React.useState(false);
    const [token, setToken] = React.useState<string>();

    React.useEffect(() => {
        (async () => {
            const [response] = await Promise.all([digitalClientInstance.refreshTokens(), delay(1500)]);
            const { status, data } = response;

            if (status === 200 && data.value) {
                digitalClientInstance.setToken(data.value);
                setToken(data.value);
            }
            setIsInitialized(true);
        })();

        return digitalClientInstance.onTokenChange(token => setToken(token));
    }, []);

    return isInitialized ? (
        <DigitalClientContext.Provider value={{ token, isInitialized }}>
            <QueryClientProvider client={digitalClientInstance.queryClient} {...props} />
        </DigitalClientContext.Provider>
    ) : (
        <ClientLoader />
    );
}

export function useDigitalClientState() {
    return React.useContext(DigitalClientContext);
}
