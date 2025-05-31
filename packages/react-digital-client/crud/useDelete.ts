import React from 'react';
import type { Result } from '@digital-net/core';
import type { RequestCallbacks } from '../types';
import { useDigitalMutation } from '../useDigitalMutation';

export function useDelete(endpoint: string, options?: RequestCallbacks<Result>) {
    const { mutate, isPending: isDeleting } = useDigitalMutation<Result, { id: string }>(
        ({ id }) => `${endpoint}/${id}`,
        {
            method: 'DELETE',
            onSuccess: async e => {
                await options?.onSuccess?.(e);
            },
            onError: async e => {
                await options?.onError?.(e);
            },
        }
    );

    const _delete = React.useCallback((id: string | number) => mutate({ params: { id: String(id) } }), [mutate]);

    return {
        delete: _delete,
        isDeleting,
    };
}
