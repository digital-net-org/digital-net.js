import * as React from 'react';
import type { EntityName, SchemaProperty } from '@digital-net-org/digital-api-sdk';

export interface DnEntitySchemaContextValue {
    schemas: Partial<Record<EntityName, SchemaProperty[]>>;
    errors: Partial<Record<EntityName, Error>>;
    loadingEntities: ReadonlySet<EntityName>;
    loadSchema: (_entityName: EntityName) => void;
}

export const DnEntitySchemaContext = React.createContext<DnEntitySchemaContextValue | null>(null);

export function useDnEntitySchemaContext(): DnEntitySchemaContextValue {
    const context = React.useContext(DnEntitySchemaContext);
    if (!context) {
        throw new Error('useDnEntitySchemaContext must be used within a DnEntitySchemaProvider.');
    }
    return context;
}
