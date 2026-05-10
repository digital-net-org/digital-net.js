import * as React from 'react';
import type { PageEntityType, TemplateVariable } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../../api';

export interface TemplateVariablesContextValue {
    variables: TemplateVariable[];
    isAvailable: boolean;
    isLoading: boolean;
    error: Error | null;
}

const TemplateVariablesContext = React.createContext<TemplateVariablesContextValue | null>(null);

export interface TemplateVariablesProviderProps {
    entityType: PageEntityType | null | undefined;
    children: React.ReactNode;
}

export function TemplateVariablesProvider({ entityType, children }: TemplateVariablesProviderProps) {
    const api = useDnApi();
    const [cache, setCache] = React.useState<Record<string, TemplateVariable[]>>({});
    const [error, setError] = React.useState<Error | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const inFlightRef = React.useRef<Set<string>>(new Set());

    React.useEffect(() => {
        if (!entityType) return;
        if (cache[entityType] !== undefined) return;
        if (inFlightRef.current.has(entityType)) return;

        inFlightRef.current.add(entityType);
        setIsLoading(true);

        (async () => {
            const result = await api.catalog.page.getTemplateVariables(entityType);
            inFlightRef.current.delete(entityType);
            if (result.hasError) {
                const message =
                    result.errors
                        .map((e: { message?: string }) => e.message)
                        .filter(Boolean)
                        .join('; ') || 'unknown error';
                setError(new Error(`Failed to load template variables: ${message}`));
            } else {
                setCache(prev => ({ ...prev, [entityType]: result.value ?? [] }));
                setError(null);
            }
            setIsLoading(false);
        })();
    }, [api, entityType, cache]);

    const value = React.useMemo<TemplateVariablesContextValue>(() => {
        const variables = entityType ? (cache[entityType] ?? []) : [];
        return {
            variables,
            isAvailable: Boolean(entityType) && variables.length > 0,
            isLoading,
            error,
        };
    }, [cache, entityType, error, isLoading]);

    return <TemplateVariablesContext.Provider value={value}>{children}</TemplateVariablesContext.Provider>;
}

export function useTemplateVariables(): TemplateVariablesContextValue {
    const context = React.useContext(TemplateVariablesContext);
    if (!context) {
        return { variables: [], isAvailable: false, isLoading: false, error: null };
    }
    return context;
}
