import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { type DigitalEndpoint, type DigitalClientRequestConfig, URI } from '@digital-net/core';
import { DigitalReactClient } from './DigitalReactClient';

export interface QueryConfig<T = any>
    extends Omit<DigitalClientRequestConfig<T>, 'options' | 'method' | 'body' | 'patch'> {
    enabled?: boolean;
    autoRefetch?: boolean;
    skipRefresh?: boolean;
}

export function useDigitalQuery<T>(
    endpoint: DigitalEndpoint,
    { skipRefresh, enabled, autoRefetch, ...config }: QueryConfig<T> = { enabled: true, autoRefetch: true }
) {
    const queryKey = React.useMemo(() => URI.applyParams(endpoint, config.params), [config.params, endpoint]);

    return useQuery<T>({
        queryKey: [queryKey],
        queryFn: async () =>
            await DigitalReactClient.request<T>(endpoint, {
                method: 'GET',
                options: { skipRefresh },
                ...(config ?? {}),
            }),
        enabled: enabled,
        refetchOnWindowFocus: autoRefetch,
        refetchOnReconnect: autoRefetch,
    });
}
