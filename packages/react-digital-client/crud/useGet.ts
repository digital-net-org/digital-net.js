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
    const { isLoading, data } = useDigitalQuery<QueryResult<EntityRaw>>(endpoint, {
        ...options,
        onSuccess: async e => await onSuccess?.({ ...e, value: e.value.map(EntityHelper.build<T>) }),
        onError: async e => await onError?.(e),
    });

    const entities = React.useMemo(() => (data ? data.value.map(EntityHelper.build<T>) : []), [data]);

    return {
        entities,
        isQuerying: isLoading,
    };
}
