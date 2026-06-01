import * as React from 'react';
import { useSearchParams } from 'react-router';

export interface UrlParam<T> {
    defaultValue: T;
    key: string;
    parse(_raw: string | null): T;
    serialize(_value: T): string | null;
}

export type UrlQuerySchema = Record<string, UrlParam<unknown>>;

export type UrlQueryState<S extends UrlQuerySchema> = {
    [K in keyof S]: S[K] extends UrlParam<infer T> ? T : never;
};

/**
 * Binds a schema of `UrlParam<T>` descriptors to the current URL's query
 * string and returns a `[state, setState]` tuple reminiscent of `useState`.
 *
 * - `state` is the parsed, typed snapshot of the current URL params.
 * - `setState(patch)` merges the given partial back into the URL; setting a
 *   field to its default (or to a value that serializes to `null`) removes
 *   the key from the URL.
 * - `options.replace` (default `true`) controls whether the update replaces
 *   the current history entry or pushes a new one.
 *
 * Build each descriptor with `UrlParamBuilder.build*`:
 *
 * ```ts
 * const [state, setState] = useUrlQueryState({
 *     page: UrlParamBuilder.buildInt(1, 'page'),
 *     search: UrlParamBuilder.buildString('', 'q'),
 * });
 * ```
 */
export function useUrlQueryState<S extends UrlQuerySchema>(
    schema: S,
    options: { replace?: boolean } = {}
): [UrlQueryState<S>, (_patch: Partial<UrlQueryState<S>>) => void] {
    const { replace = true } = options;
    const [searchParams, setSearchParams] = useSearchParams();

    const state = React.useMemo(() => {
        const result = {} as UrlQueryState<S>;
        for (const key in schema) {
            (result as Record<string, unknown>)[key] = schema[key].parse(searchParams.get(schema[key].key));
        }
        return result;
    }, [schema, searchParams]);

    const setState = React.useCallback(
        (patch: Partial<UrlQueryState<S>>) => {
            setSearchParams(
                prev => {
                    const next = new URLSearchParams(prev);
                    for (const key in patch) {
                        const urlKey = schema[key].key;
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
