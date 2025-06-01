/**
 * Joins strings in a formatted url.
 * @param paths - The strings to resolve.
 * @returns The formatted url.
 *
 * @example
 * ```ts
 * resolve('https://example.com', '/auth', 'login') // 'https://example.com/auth/login'
 * ```
 */
const resolve = (...paths: Array<string>) => paths.map(str => str.replace(new RegExp('^/|/$', 'g'), '')).join('/');

/**
 * Builds a formatted query string.
 * @param obj - The object to build the query string.
 * @returns The formatted query string.
 *
 * @example
 * ```ts
 * buildParams({ key: 'value', key2: 'value2', key3: 'value3' })
 * // returns 'key=value&key2=value2&key3=value3'
 * ```
 */
const buildParams = (obj?: Record<string, any> | null): string =>
    Object.keys(obj ?? [])
        .filter(x => obj?.[x] || (!obj?.[x] && (typeof obj?.[x] === 'number' || typeof obj?.[x] === 'boolean')))
        .map(key => `${key}=${obj?.[key]}`)
        .join('&');

/**
 * Builds a formatted url with query string.
 * @param url - The url to build.
 * @param query - The query string to build.
 * @returns The formatted url with query string.
 *
 * @example
 * ```ts
 * buildQuery('https://localhost:3000/', { key: 'value', key2: 'value2' })
 * // returns 'https://localhost:3000/?key=value&key2=value2&key3=value3'
 * ```
 */
const buildQuery = (url: string, query?: Record<string, any> | null): string => {
    const queryString = buildParams(query ?? {});
    return queryString.length > 0 ? `${url}?${queryString}` : url;
};

/**
 * Applies parameters to a URL with path variables.
 * @param url - The URL with path variables (e.g., '/users/:id').
 * @param params - An object containing the parameters to apply.
 * @returns The URL with the parameters applied.
 *
 * @example
 * ```ts
 * applyParams('/users/:id', { id: 123 }) // returns '/users/123'
 * ```
 */
const applyParams = (url: string, params: Record<string, string | number | undefined> = {}): string => {
    const [path, query] = url.split('?');
    const parsed = path.replace(/:([a-zA-Z0-9_]+)/g, (match, key) =>
        key in params ? encodeURIComponent(String(params[key])) : match
    );
    return query ? `${parsed}?${query}` : parsed;
};

export default { applyParams, resolve, buildParams, buildQuery };
