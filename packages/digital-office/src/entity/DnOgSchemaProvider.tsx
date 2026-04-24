import * as React from 'react';
import type { OpenGraphPropertySchema } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../api';

export interface DnOgSchemaContextValue {
    schema: OpenGraphPropertySchema[] | null;
    error: Error | null;
    loading: boolean;
    loadSchema: () => void;
    reload: () => void;
}

const DnOgSchemaContext = React.createContext<DnOgSchemaContextValue | null>(null);

export interface DnOgSchemaProviderProps {
    children: React.ReactNode;
}

export function DnOgSchemaProvider({ children }: DnOgSchemaProviderProps) {
    const api = useDnApi();
    const [schema, setSchema] = React.useState<OpenGraphPropertySchema[] | null>(null);
    const [error, setError] = React.useState<Error | null>(null);
    const [loading, setLoading] = React.useState(false);
    const inFlightRef = React.useRef(false);
    const loadedRef = React.useRef(false);

    const fetchSchema = React.useCallback(() => {
        if (loadedRef.current || inFlightRef.current) return;
        inFlightRef.current = true;
        setLoading(true);
        (async () => {
            const result = await api.catalog.page.getOpenGraphSchema();
            loadedRef.current = true;
            inFlightRef.current = false;
            if (result.hasError) {
                const message =
                    result.errors
                        .map((e: { message?: string }) => e.message)
                        .filter(Boolean)
                        .join('; ') || 'unknown error';
                setError(new Error(`Failed to load OpenGraph schema: ${message}`));
            } else {
                setSchema(result.value);
                setError(null);
            }
            setLoading(false);
        })();
    }, [api]);

    const reload = React.useCallback(() => {
        loadedRef.current = false;
        inFlightRef.current = false;
        setSchema(null);
        setError(null);
        fetchSchema();
    }, [fetchSchema]);

    const value = React.useMemo<DnOgSchemaContextValue>(
        () => ({ schema, error, loading, loadSchema: fetchSchema, reload }),
        [schema, error, loading, fetchSchema, reload]
    );

    return <DnOgSchemaContext.Provider value={value}>{children}</DnOgSchemaContext.Provider>;
}

export function useDnOgSchema(): DnOgSchemaContextValue {
    const context = React.useContext(DnOgSchemaContext);
    if (!context) {
        throw new Error('useDnOgSchema must be used within a DnOgSchemaProvider.');
    }
    return context;
}
