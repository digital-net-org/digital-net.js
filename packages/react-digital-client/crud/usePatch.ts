import React from 'react';
import { type Entity, EntityHelper, type Result } from '@digital-net/core';
import { type RequestCallbacks } from '../types';
import { useDigitalMutation } from '../useDigitalMutation';

export function usePatch<T extends Entity>(endpoint: string, options?: RequestCallbacks<Result<T>>) {
    const { mutate, isPending: isPatching } = useDigitalMutation<Result<T>, { id: string }>(
        ({ id }) => `${endpoint}/${id}`,
        {
            method: 'PATCH',
            onSuccess: async e => {
                await options?.onSuccess?.(e);
            },
            onError: async e => {
                await options?.onError?.(e);
            },
        }
    );

    const patch = React.useCallback(
        (id: string | number, patch: Partial<T>) =>
            mutate({
                params: { id: String(id) },
                patch: EntityHelper.buildPatch<T>(patch),
            }),
        [mutate]
    );

    return {
        patch,
        isPatching,
    };
}
