import React from 'react';
import { type Patch, type DigitalCrudEndpoint, type Entity, type Result } from '@digital-net/core';
import { type CrudConfig } from './CrudConfig';
import { useDigitalMutation } from '../useDigitalMutation';

export function usePatch<T extends Entity>(endpoint: DigitalCrudEndpoint, options: CrudConfig<Result<T>> = {}) {
    const { mutate, isPending: isPatching } = useDigitalMutation<Result<T>, T>(`${endpoint}/:id`, {
        method: 'PATCH',
        ...options,
    });

    const patch = React.useCallback(
        (id: string, patch: Patch) => mutate({ params: { id: String(id) }, patch }),
        [mutate]
    );

    return {
        patch,
        isPatching,
    };
}
