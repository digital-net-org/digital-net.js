import type { HttpMethod } from './HttpMethod';
import type { HttpResponse } from './HttpResponse';

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
    /**
     * Hook invoked just before `fetch()`. Receives the raw config and must return
     * it (possibly mutated). Use the spread pattern to avoid accidental mutation:
     * `onRequest: cfg => ({ ...cfg, headers: { ...cfg.headers, 'X-Trace': 'abc' } })`.
     *
     * Runs AGAIN on the retry after a 401→refresh→retry cycle. Does NOT run on the
     * internal refresh-token request. Exceptions propagate to the caller.
     */
    onRequest?: (_config: HttpRequestConfig<B>) => HttpRequestConfig<B> | Promise<HttpRequestConfig<B>>;
    /**
     * Hook invoked after `deserializeBody`, BEFORE error handling — meaning the hook
     * also fires on 4xx/5xx responses (inspect `response.ok`/`response.status`).
     *
     * Runs AGAIN on the retry after a 401→refresh→retry cycle. Does NOT run on the
     * internal refresh-token request. Exceptions propagate to the caller.
     */
    onResponse?: (_response: HttpResponse<unknown>) => void | Promise<void>;
    /**
     * @internal
     * When true, `onRequest` and `onResponse` are skipped for this request. Used
     * internally by the SDK to prevent user hooks from seeing the refresh-token
     * round-trip. Do NOT set this from application code.
     */
    skipHooks?: boolean;
}
