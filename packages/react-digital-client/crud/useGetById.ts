import React from 'react';
import { EntityHelper, type Entity, type EntityRaw, type Result } from '@digital-net/core';
import type { QueryOptions, RequestCallbacks } from '../types';
import { DigitalClient } from '../../core/digital-api/DigitalClient';
import { useDigitalQuery } from '../useDigitalQuery';

export function useGetById<T extends Entity>(
    endpoint: string,
    id: string | number | undefined,
    options?: RequestCallbacks<Result<T>> & QueryOptions
) {
    const [entity, setEntity] = React.useState<T | undefined>(undefined);
    const { isLoading } = useDigitalQuery<Result<EntityRaw>>(!id ? undefined : `${endpoint}/${id}`, {
        ...(options ?? {}),
        onSuccess: async e => {
            const result = { ...e, value: EntityHelper.build<T>(e.value) };
            setEntity(result.value);
            await options?.onSuccess?.(result);
        },
        onError: async e => {
            await options?.onError?.(e);
        },
    });

    return {
        entity,
        isQuerying: isLoading,
    };
}
