import * as React from 'react';
import type { SchemaProperty, EntityName } from '@digital-net-org/digital-api-sdk';
import { useDnEntitySchemaContext } from './useDnEntitySchemaContext';

export interface UseEntitySchemaResult {
    schemas: SchemaProperty[];
    loading: boolean;
}

export function useEntitySchema(entityName: EntityName): UseEntitySchemaResult {
    const { schemas, errors, loadingEntities, loadSchema } = useDnEntitySchemaContext();

    React.useEffect(() => loadSchema(entityName), [entityName, loadSchema]);

    const error = errors[entityName];
    if (error) throw error;

    return {
        schemas: schemas[entityName] ?? [],
        loading: loadingEntities.has(entityName) || !(entityName in schemas),
    };
}
