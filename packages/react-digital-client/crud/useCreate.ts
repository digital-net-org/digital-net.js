import React from 'react';
import type { Entity, Result } from '@digital-net/core';
import type { RequestCallbacks } from '../types';
import { useDigitalMutation } from '../useDigitalMutation';

export function useCreate<T extends Entity>(endpoint: string, options?: RequestCallbacks<Result<T>>) {
    const { mutate, isPending: isCreating } = useDigitalMutation<Result<T>>(endpoint, {
        onSuccess: async e => {
            await options?.onSuccess?.(e);
        },
        onError: async e => {
            await options?.onError?.(e);
        },
    });

    const create = React.useCallback((body: Partial<T>) => mutate({ body }), [mutate]);

    return {
        create,
        isCreating,
    };
}
