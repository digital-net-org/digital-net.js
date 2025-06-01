import React from 'react';
import type { DigitalCrudEndpoint, Entity, Result } from '@digital-net/core';
import type { CrudConfig } from './CrudConfig';
import { useDigitalMutation } from '../useDigitalMutation';

export function useCreate<T extends Entity>(endpoint: DigitalCrudEndpoint, config: CrudConfig<Result<T>> = {}) {
    const { mutate, isPending: isCreating } = useDigitalMutation<Result<T>>(endpoint, { method: 'POST', ...config });
    const create = React.useCallback((body: Partial<T>) => mutate({ body }), [mutate]);
    return {
        create,
        isCreating,
    };
}
