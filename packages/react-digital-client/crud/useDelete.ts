import React from 'react';
import type { DigitalCrudEndpoint, Result } from '@digital-net/core';
import type { CrudConfig } from './CrudConfig';
import { useDigitalMutation } from '../useDigitalMutation';

export function useDelete(endpoint: DigitalCrudEndpoint, config: CrudConfig<Result> = {}) {
    const { mutate, isPending: isDeleting } = useDigitalMutation<Result>(`${endpoint}/:id`, {
        method: 'DELETE',
        ...config,
    });
    const _delete = React.useCallback((id: string | number) => mutate({ params: { id: String(id) } }), [mutate]);
    return {
        delete: _delete,
        isDeleting,
    };
}
