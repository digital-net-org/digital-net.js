import React from 'react';
import type { DigitalCrudEndpoint, EntitySchema, Result } from '@digital-net/core';
import { useDigitalQuery } from '../useDigitalQuery';

export function useSchema(endpoint: DigitalCrudEndpoint) {
    const { data, isLoading } = useDigitalQuery<Result<EntitySchema>>(`${endpoint}/schema` as DigitalCrudEndpoint);
    const schema = React.useMemo(() => data?.value ?? [], [data]);
    return {
        schema,
        isLoading,
    };
}
