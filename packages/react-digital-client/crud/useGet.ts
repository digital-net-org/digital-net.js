import React from 'react';
import { EntityHelper, type Entity, type EntityRaw, type QueryResult } from '@digital-net/core';
import { type QueryOptions, type RequestCallbacks } from '../types';
import { useDigitalQuery } from '../useDigitalQuery';

export function useGet<T extends Entity>(endpoint: string, options?: RequestCallbacks<QueryResult<T>> & QueryOptions) {
    const [entities, setEntities] = React.useState<T[]>([]);

    const { isLoading } = useDigitalQuery<QueryResult<EntityRaw>>(endpoint, {
        ...(options ?? {}),
        onSuccess: async e => {
            const result = { ...e, value: e.value.map(EntityHelper.build<T>) };
            setEntities(result.value);
            await options?.onSuccess?.(result);
        },
        onError: async e => {
            await options?.onError?.(e);
        },
    });

    return {
        entities,
        isQuerying: isLoading,
    };
}
