import React from 'react';
import {
    EntityHelper,
    type DigitalCrudEndpoint,
    type Entity,
    type EntityRaw,
    type QueryResult,
} from '@digital-net/core';
import { useDigitalQuery } from '../useDigitalQuery';
import { type CrudQueryConfig } from './CrudConfig';

export function useGet<T extends Entity>(
    endpoint: DigitalCrudEndpoint,
    { onError, onSuccess, ...options }: CrudQueryConfig<QueryResult<T>> = {}
) {
    const [entities, setEntities] = React.useState<T[]>([]);

    const { isLoading } = useDigitalQuery<QueryResult<EntityRaw>>(endpoint, {
        ...options,
        onSuccess: async e => {
            const result = { ...e, value: e.value.map(EntityHelper.build<T>) };
            setEntities(result.value);
            await onSuccess?.(result);
        },
        onError: async e => {
            await onError?.(e);
        },
    });

    return {
        entities,
        isQuerying: isLoading,
    };
}
