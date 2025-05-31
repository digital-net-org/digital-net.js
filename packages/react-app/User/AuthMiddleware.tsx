import React from 'react';
import { digitalEndpoints, headersDictionary } from '@digital-net/core';
import { DigitalReactClient } from '@digital-net/react-digital-client';
import { useJwt } from './User';

export default function AuthMiddleware() {
    const [token, setToken] = useJwt();

    React.useEffect(() => {
        const disposeReqHandler = DigitalReactClient.setRequestHandler(async req => {
            if (token) req.headers['Authorization'] = `Bearer ${token}`;
            return req;
        });
        const disposeResHandler = DigitalReactClient.setResponseHandler(
            response => response,
            async (error, response, originalRequest) => {
                const isUnauthorized = response.status === 401;
                const skipRefresh = originalRequest.headers?.[headersDictionary.skipRefresh] === 'true';

                if (!isUnauthorized || !token || skipRefresh) {
                    return Promise.resolve(response);
                }

                const isRefreshing = originalRequest.url === digitalEndpoints['authentication/user/refresh'];

                if (isRefreshing) {
                    setToken(undefined);
                    return Promise.reject(error);
                }

                if (!isUnauthorized || originalRequest._retry === true) {
                    return Promise.reject(error);
                }

                originalRequest._retry = true;
                const { status, data } = await DigitalReactClient.refreshTokens();
                if (status !== 200 || !data.value) {
                    setToken(undefined);
                    return Promise.reject(error);
                }
                setToken(data.value);
                originalRequest.headers['Authorization'] = `Bearer ${data.value}`;
                return DigitalReactClient.request(originalRequest);
            }
        );
        return () => {
            disposeReqHandler();
            disposeResHandler();
        };
    }, [setToken, token]);

    return <React.Fragment />;
}
