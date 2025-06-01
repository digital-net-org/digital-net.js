import React from 'react';
import { type DigitalCrudEndpoint, type Entity, type EntityRaw, type Result, EntityHelper } from '@digital-net/core';
import { type CrudQueryConfig } from './CrudConfig';
import { useDigitalQuery } from '../useDigitalQuery';

export function useGetById<T extends Entity>(
    endpoint: DigitalCrudEndpoint,
    id: string | number | undefined,
    { onError, onSuccess, slugs, ...options }: CrudQueryConfig<Result<T>> = {}
) {
    const [entity, setEntity] = React.useState<T | undefined>(undefined);
    const { isLoading } = useDigitalQuery<Result<EntityRaw>>(`${endpoint}/:id`, {
        ...options,
        onSuccess: async e => {
            const result = { ...e, value: EntityHelper.build<T>(e.value) };
            setEntity(result.value);
            await onSuccess?.(result);
        },
        onError: async e => {
            await onError?.(e);
        },
        slugs: { ...(slugs ?? {}), id: String(id) },
        enabled: !!id,
    });

    return {
        entity,
        isQuerying: isLoading,
    };
}
