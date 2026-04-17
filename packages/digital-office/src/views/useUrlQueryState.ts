import * as React from 'react';
import { useSearchParams } from 'react-router';

export interface UrlParam<T> {
    defaultValue: T;
    key?: string;
    parse(raw: string | null): T;
    serialize(value: T): string | null;
}

export type UrlQuerySchema = Record<string, UrlParam<unknown>>;

export type UrlQueryState<S extends UrlQuerySchema> = {
    [K in keyof S]: S[K] extends UrlParam<infer T> ? T : never;
};

export const urlString = (defaultValue: string = '', key?: string): UrlParam<string> => ({
    defaultValue,
    key,
    parse: raw => raw ?? defaultValue,
    serialize: value => value || null,
});

export const urlInt = (defaultValue: number = 0, key?: string): UrlParam<number> => ({
    defaultValue,
    key,
    parse: raw => (raw !== null ? parseInt(raw) || defaultValue : defaultValue),
    serialize: value => String(value),
});

export const urlFloat = (defaultValue: number = 0, key?: string): UrlParam<number> => ({
    defaultValue,
    key,
    parse: raw => (raw !== null ? parseFloat(raw) || defaultValue : defaultValue),
    serialize: value => String(value),
});

export const urlDate = (defaultValue: Date | null = null, key?: string): UrlParam<Date | null> => ({
    defaultValue,
    key,
    parse: raw => {
        if (!raw) return defaultValue;
        const d = new Date(raw);
        return isNaN(d.getTime()) ? defaultValue : d;
    },
    serialize: value => value?.toISOString() ?? null,
});

export const urlArray = (defaultValue: string[] = [], key?: string): UrlParam<string[]> => ({
    defaultValue,
    key,
    parse: raw => (raw ? raw.split(',').filter(Boolean) : defaultValue),
    serialize: value => (value.length ? value.join(',') : null),
});

export const urlObject = <T>(defaultValue: T, key?: string): UrlParam<T> => ({
    defaultValue,
    key,
    parse: raw => {
        if (!raw) return defaultValue;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return defaultValue;
        }
    },
    serialize: value => {
        try {
            const s = JSON.stringify(value);
            return s === '{}' || s === '[]' || s === 'null' ? null : s;
        } catch {
            return null;
        }
    },
});

export function useUrlQueryState<S extends UrlQuerySchema>(
    schema: S,
    options: { replace?: boolean } = {}
): [UrlQueryState<S>, (patch: Partial<UrlQueryState<S>>) => void] {
    const { replace = true } = options;
    const [searchParams, setSearchParams] = useSearchParams();

    const state = React.useMemo(() => {
        const result = {} as UrlQueryState<S>;
        for (const key in schema) {
            const urlKey = schema[key].key ?? key;
            (result as Record<string, unknown>)[key] = schema[key].parse(searchParams.get(urlKey));
        }
        return result;
    }, [schema, searchParams]);

    const setState = React.useCallback(
        (patch: Partial<UrlQueryState<S>>) => {
            setSearchParams(
                prev => {
                    const next = new URLSearchParams(prev);
                    for (const key in patch) {
                        const urlKey = schema[key].key ?? key;
                        const serialized = schema[key].serialize(patch[key] as never);
                        if (serialized === null) {
                            next.delete(urlKey);
                        } else {
                            next.set(urlKey, serialized);
                        }
                    }
                    return next;
                },
                { replace }
            );
        },
        [schema, setSearchParams, replace]
    );

    return [state, setState];
}
