import * as React from 'react';
import type { OpenGraphPropertySchema } from '@digital-net-org/digital-api-sdk';

export interface DnOgSchemaContextValue {
    schema: OpenGraphPropertySchema[] | null;
    error: Error | null;
    loading: boolean;
    loadSchema: () => void;
    reload: () => void;
}

export const DnOgSchemaContext = React.createContext<DnOgSchemaContextValue | null>(null);

export function useDnOgSchema(): DnOgSchemaContextValue {
    const context = React.useContext(DnOgSchemaContext);
    if (!context) {
        throw new Error('useDnOgSchema must be used within a DnOgSchemaProvider.');
    }
    return context;
}
