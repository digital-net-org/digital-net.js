import React from 'react';
import type { EntitySchema, Result } from '@digital-net/core';
import { useDigitalQuery } from '../useDigitalQuery';

export function useSchema(endpoint: string) {
    const { data, isLoading } = useDigitalQuery<Result<EntitySchema>>(`${endpoint}/schema`);
    const schema = React.useMemo(() => data?.value ?? [], [data]);

    return {
        schema,
        isLoading,
    };
}
