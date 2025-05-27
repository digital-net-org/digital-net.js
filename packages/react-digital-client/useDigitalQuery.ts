import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { headersDictionary, ObjectMatcher } from '@digital-lib/core';
import { type QueryConfig } from './types';
import { ResponseHandler } from './ResponseHandler';
import { DigitalClient } from '@digital-net/core';

export function useDigitalQuery<T>(
    key: string | undefined,
    { onError, onSuccess, skipRefresh, trigger, ...options }: QueryConfig<T> = {
        autoRefetch: true,
    }
) {
    const resolvedKey = React.useMemo(() => (key && trigger !== false ? key : undefined), [key, trigger]);

    const { data: queryResult, ...response } = useQuery<T>({
        queryKey: resolvedKey ? [key] : [],
        queryFn: async () => {
            if (!resolvedKey) {
                return {} as T;
            }
            return ResponseHandler.handle(
                await DigitalClient.get<T>(resolvedKey, {
                    ...options,
                    headers: {
                        ...options.headers,
                        [headersDictionary.skipRefresh]: skipRefresh ? 'true' : 'false',
                    },
                }),
                { onError, onSuccess }
            );
        },
        ...options,
    });

    const data = React.useMemo(
        () => (ObjectMatcher.deepEquality(queryResult, {} as typeof queryResult) ? undefined : queryResult),
        [queryResult]
    );

    return { data, ...response };
}
