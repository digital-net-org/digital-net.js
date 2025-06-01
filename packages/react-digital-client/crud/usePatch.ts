import React from 'react';
import { type DigitalCrudEndpoint, type Entity, type Result, EntityHelper } from '@digital-net/core';
import { type CrudConfig } from './CrudConfig';
import { useDigitalMutation } from '../useDigitalMutation';

export function usePatch<T extends Entity>(endpoint: DigitalCrudEndpoint, options: CrudConfig<Result<T>> = {}) {
    const { mutate, isPending: isPatching } = useDigitalMutation<Result<T>, T>(`${endpoint}/:id`, {
        method: 'PATCH',
        ...options,
    });

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
