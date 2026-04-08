import type { HttpMethod } from './HttpMethod';

export interface HttpRequestConfig<B = any> {
    /** Relative path (e.g. `user/self`, `user/:id`). Merged with `baseUrl`. */
    path: string;
    method?: HttpMethod;
    /** Path variables (e.g. `{ id: 42 }` replaces `:id`). */
    slugs?: Record<string, string | number>;
    /** Query string parameters. */
    params?: Record<string, unknown>;
    /** Extra headers merged on top of the default ones. */
    headers?: Record<string, string>;
    /** Request body. JSON-serialized unless it is a FormData / Blob / ArrayBuffer / URLSearchParams / string. */
    body?: B;
    /** Skip the automatic `Authorization: Bearer ...` header. */
    skipAuth?: boolean;
    /** Skip the automatic refresh-on-401 flow. */
    skipRefresh?: boolean;
    /** Override the default `'include'` credentials policy for this request. */
    credentials?: RequestCredentials;
    /** Abort signal forwarded to `fetch`. */
    signal?: AbortSignal;
}
