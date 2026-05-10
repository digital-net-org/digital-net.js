import * as React from 'react';
import type { Result, TemplateVariable } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../api';

export type DnEntityVariableKey = 'page:article' | 'page:form';

type Fetcher = () => Promise<Result<TemplateVariable[]>>;

export interface DnEntityVariablesContextValue {
    variables: Partial<Record<DnEntityVariableKey, TemplateVariable[]>>;
    errors: Partial<Record<DnEntityVariableKey, Error>>;
    loadingKeys: ReadonlySet<DnEntityVariableKey>;
    loadVariables: (_key: DnEntityVariableKey) => void;
}

const DnEntityVariablesContext = React.createContext<DnEntityVariablesContextValue | null>(null);

export interface DnEntityVariablesProviderProps {
    children: React.ReactNode;
}

export function DnEntityVariablesProvider({ children }: DnEntityVariablesProviderProps) {
    const api = useDnApi();
    const [variables, setVariables] = React.useState<Partial<Record<DnEntityVariableKey, TemplateVariable[]>>>({});
    const [errors, setErrors] = React.useState<Partial<Record<DnEntityVariableKey, Error>>>({});
    const [loadingKeys, setLoadingKeys] = React.useState<ReadonlySet<DnEntityVariableKey>>(() => new Set());
    const inFlightRef = React.useRef<Set<DnEntityVariableKey>>(new Set());
    const loadedRef = React.useRef<Set<DnEntityVariableKey>>(new Set());

    const registry = React.useMemo<Record<DnEntityVariableKey, Fetcher>>(
        () => ({
            'page:article': () => api.catalog.page.getTemplateVariables('Article'),
            'page:form': () => api.catalog.page.getTemplateVariables('Form'),
        }),
        [api]
    );

    const loadVariables = React.useCallback(
        (key: DnEntityVariableKey) => {
            if (loadedRef.current.has(key) || inFlightRef.current.has(key)) return;
            inFlightRef.current.add(key);
            setLoadingKeys(prev => {
                const next = new Set(prev);
                next.add(key);
                return next;
            });
            (async () => {
                const result = await registry[key]();
                loadedRef.current.add(key);
                inFlightRef.current.delete(key);
                if (result.hasError) {
                    const apiMessage =
                        result.errors
                            .map(e => e.message)
                            .filter(Boolean)
                            .join('; ') || 'unknown error';
                    const error = new Error(`Failed to load entity variables "${key}": ${apiMessage}`);
                    setErrors(prev => ({ ...prev, [key]: error }));
                } else {
                    setVariables(prev => ({ ...prev, [key]: result.value ?? [] }));
                }
                setLoadingKeys(prev => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            })();
        },
        [registry]
    );

    const value = React.useMemo<DnEntityVariablesContextValue>(
        () => ({ variables, errors, loadingKeys, loadVariables }),
        [variables, errors, loadingKeys, loadVariables]
    );

    return <DnEntityVariablesContext.Provider value={value}>{children}</DnEntityVariablesContext.Provider>;
}

export function useDnEntityVariablesContext(): DnEntityVariablesContextValue {
    const context = React.useContext(DnEntityVariablesContext);
    if (!context) {
        throw new Error('useDnEntityVariablesContext must be used within a DnEntityVariablesProvider.');
    }
    return context;
}
