import React from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    type Params,
    type Body,
    type Patch,
    type DigitalClientRequestConfig,
    type DigitalEndpoint,
    URI,
} from '@digital-net/core';
import { DigitalReactClient } from './DigitalReactClient';

export interface MutationPayload<T = any> {
    body?: Body;
    patch?: Patch<T>;
    params?: Params;
}

export interface MutationConfig<T = any> extends Omit<DigitalClientRequestConfig<T>, 'options' | 'body' | 'patch'> {
    retry?: number;
    skipRefresh?: boolean;
    withCredentials?: boolean;
}

export function useDigitalMutation<T, P = object>(
    endpoint: DigitalEndpoint,
    { method, retry, skipRefresh, withCredentials, ...config }: MutationConfig<T> = {}
) {
    const url = React.useMemo(() => URI.applyParams(endpoint, config?.params), [config?.params, endpoint]);

    const mutation = useMutation<T, any, MutationPayload<P>>({
        mutationFn: async ({ body, patch, params }) => {
            return await DigitalReactClient.request<T>(url as DigitalEndpoint, {
                method: method ?? 'POST',
                ...(config ?? {}),
                params: { ...(config?.params ?? {}), ...(params ?? {}) },
                body: body ?? patch ?? {},
                options: { skipRefresh, withCredentials },
            });
        },
        retry: retry ?? 0,
    });

    return {
        ...mutation,
        mutate: (payload?: MutationPayload<P>) => mutation.mutate(payload ?? {}) as T,
        mutateAsync: async (payload?: MutationPayload<P>) => await mutation.mutateAsync(payload ?? {}),
    };
}
