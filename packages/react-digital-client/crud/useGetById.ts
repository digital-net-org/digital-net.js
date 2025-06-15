import React from 'react';
import { type DigitalCrudEndpoint, type Entity, type EntityRaw, type Result, EntityHelper } from '@digital-net/core';
import { type CrudQueryConfig } from './CrudConfig';
import { useDigitalQuery } from '../useDigitalQuery';

export function useGetById<T extends Entity>(
    endpoint: DigitalCrudEndpoint,
    id: string | number | undefined,
    { onError, onSuccess, slugs, ...options }: CrudQueryConfig<Result<T>> = {}
) {
    const { isLoading, data } = useDigitalQuery<Result<EntityRaw>>(`${endpoint}/:id`, {
        ...options,
        onSuccess: async e => (e.value ? await onSuccess?.({ ...e, value: EntityHelper.build<T>(e.value) }) : void 0),
        onError: async e => await onError?.(e),
        slugs: { ...(slugs ?? {}), id: String(id) },
        enabled: Boolean(id),
    });

    const entity = React.useMemo(
        () => (id && !data?.hasError && data?.value ? EntityHelper.build<T>(data.value) : undefined),
        [data, id]
    );

    return {
        entity,
        isQuerying: isLoading,
    };
}
