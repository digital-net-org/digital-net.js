import * as React from 'react';
import type { SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { type DnEntityName, useDnEntitySchemaContext } from './DnEntitySchemaProvider';

export interface UseEntitySchemaResult {
    schemas: SchemaProperty[];
    loading: boolean;
}

export function useEntitySchema(entityName: DnEntityName): UseEntitySchemaResult {
    const { schemas, errors, loadingEntities, loadSchema } = useDnEntitySchemaContext();

    React.useEffect(() => loadSchema(entityName), [entityName, loadSchema]);

    const error = errors[entityName];
    if (error) throw error;

    return {
        schemas: schemas[entityName] ?? [],
        loading: loadingEntities.has(entityName) || !(entityName in schemas),
    };
}
