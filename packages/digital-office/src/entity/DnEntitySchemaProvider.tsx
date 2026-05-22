import * as React from 'react';
import type { SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../api';

export type DnEntityName =
    | 'page'
    | 'user'
    | 'pageSheet'
    | 'pageMedia'
    | 'openGraphEntry'
    | 'tag'
    | 'media'
    | 'article'
    | 'articleMedia';

const DN_ENTITY_API_PATH: Record<DnEntityName, string> = {
    page: 'cms/pages',
    user: 'user',
    pageSheet: 'cms/pages/sheet',
    pageMedia: 'cms/pages/media',
    openGraphEntry: 'cms/pages/open-graph-entry',
    tag: 'cms/tags',
    media: 'cms/media',
    article: 'cms/articles',
    articleMedia: 'cms/articles/media',
};

export interface DnEntitySchemaContextValue {
    schemas: Partial<Record<DnEntityName, SchemaProperty[]>>;
    errors: Partial<Record<DnEntityName, Error>>;
    loadingEntities: ReadonlySet<DnEntityName>;
    loadSchema: (_entityName: DnEntityName) => void;
}

const DnEntitySchemaContext = React.createContext<DnEntitySchemaContextValue | null>(null);

export interface DnEntitySchemaProviderProps {
    children: React.ReactNode;
}

export function DnEntitySchemaProvider({ children }: DnEntitySchemaProviderProps) {
    const api = useDnApi();
    const [schemas, setSchemas] = React.useState<Partial<Record<DnEntityName, SchemaProperty[]>>>({});
    const [errors, setErrors] = React.useState<Partial<Record<DnEntityName, Error>>>({});
    const [loadingEntities, setLoadingEntities] = React.useState<ReadonlySet<DnEntityName>>(() => new Set());
    const inFlightRef = React.useRef<Set<DnEntityName>>(new Set());
    const loadedRef = React.useRef<Set<DnEntityName>>(new Set());

    const loadSchema = React.useCallback(
        (entityName: DnEntityName) => {
            if (loadedRef.current.has(entityName) || inFlightRef.current.has(entityName)) return;
            inFlightRef.current.add(entityName);
            setLoadingEntities(prev => {
                const next = new Set(prev);
                next.add(entityName);
                return next;
            });
            (async () => {
                const result = await api.catalog.getSchema(DN_ENTITY_API_PATH[entityName]);
                loadedRef.current.add(entityName);
                inFlightRef.current.delete(entityName);
                if (result.hasError) {
                    const apiMessage =
                        result.errors
                            .map(e => e.message)
                            .filter(Boolean)
                            .join('; ') || 'unknown error';
                    const error = new Error(`Failed to load entity schema "${entityName}": ${apiMessage}`);
                    setErrors(prev => ({ ...prev, [entityName]: error }));
                } else {
                    setSchemas(prev => ({ ...prev, [entityName]: result.value }));
                }
                setLoadingEntities(prev => {
                    const next = new Set(prev);
                    next.delete(entityName);
                    return next;
                });
            })();
        },
        [api]
    );

    const value = React.useMemo<DnEntitySchemaContextValue>(
        () => ({ schemas, errors, loadingEntities, loadSchema }),
        [schemas, errors, loadingEntities, loadSchema]
    );

    return <DnEntitySchemaContext.Provider value={value}>{children}</DnEntitySchemaContext.Provider>;
}

export function useDnEntitySchemaContext(): DnEntitySchemaContextValue {
    const context = React.useContext(DnEntitySchemaContext);
    if (!context) {
        throw new Error('useDnEntitySchemaContext must be used within a DnEntitySchemaProvider.');
    }
    return context;
}
