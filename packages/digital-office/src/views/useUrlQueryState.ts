import * as React from 'react';
import { useSearchParams } from 'react-router';

export interface UrlParam<T> {
    defaultValue: T;
    parse(raw: string | null): T;
    serialize(value: T): string | null;
}

export type UrlQuerySchema = Record<string, UrlParam<unknown>>;

export type UrlQueryState<S extends UrlQuerySchema> = {
    [K in keyof S]: S[K] extends UrlParam<infer T> ? T : never;
};

export const urlString = (defaultValue: string = ''): UrlParam<string> => ({
    defaultValue,
    parse: raw => raw ?? defaultValue,
    serialize: value => value || null,
});

export const urlInt = (defaultValue: number = 0): UrlParam<number> => ({
    defaultValue,
    parse: raw => (raw !== null ? parseInt(raw) || defaultValue : defaultValue),
    serialize: value => String(value),
});

export const urlFloat = (defaultValue: number = 0): UrlParam<number> => ({
    defaultValue,
    parse: raw => (raw !== null ? parseFloat(raw) || defaultValue : defaultValue),
    serialize: value => String(value),
});

export const urlDate = (defaultValue: Date | null = null): UrlParam<Date | null> => ({
    defaultValue,
    parse: raw => {
        if (!raw) return defaultValue;
        const d = new Date(raw);
        return isNaN(d.getTime()) ? defaultValue : d;
    },
    serialize: value => value?.toISOString() ?? null,
});

export const urlArray = (defaultValue: string[] = []): UrlParam<string[]> => ({
    defaultValue,
    parse: raw => (raw ? raw.split(',').filter(Boolean) : defaultValue),
    serialize: value => (value.length ? value.join(',') : null),
});

export const urlObject = <T>(defaultValue: T): UrlParam<T> => ({
    defaultValue,
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
            (result as Record<string, unknown>)[key] = schema[key].parse(searchParams.get(key));
        }
        return result;
    }, [schema, searchParams]);

    const setState = React.useCallback(
        (patch: Partial<UrlQueryState<S>>) => {
            setSearchParams(
                prev => {
                    const next = new URLSearchParams(prev);
                    for (const key in patch) {
                        const serialized = schema[key].serialize(patch[key] as never);
                        if (serialized === null) {
                            next.delete(key);
                        } else {
                            next.set(key, serialized);
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
