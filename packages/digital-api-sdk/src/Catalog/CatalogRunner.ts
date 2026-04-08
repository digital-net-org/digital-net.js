import { HttpClientError } from '../HttpClient';
import type { HttpClient, HttpRequestConfig } from '../HttpClient';
import type { Result } from '../types';
import type { CatalogError, CatalogCallbacks } from './types';

export class CatalogRunner {
    /**
     * Executes an HttpClient request and dispatches granular callbacks on the
     * resulting `Result<T>`. Assumes the backend contract: every JSON response
     * is a `Result<T>`. On `204 No Content`, synthesizes an empty success Result.
     *
     * HTTP errors (4xx/5xx) do NOT throw: they return the server's `Result<T>`
     * (available on `HttpClientError.data`) so the caller can inspect `hasError`
     * inline without try/catch. Network errors (non-`HttpClientError`) bubble up.
     *
     * Callback order on error: `onReference[ref]` (for each matching ref in
     * `result.errors`) → `onStatus[status]` → `onError`. All matching callbacks
     * are invoked; none of them short-circuit the others.
     */
    public static async run<T>(
        http: HttpClient,
        request: HttpRequestConfig,
        options: CatalogCallbacks<T> = {}
    ): Promise<Result<T>> {
        try {
            const response = await http.request<Result<T>>(request);
            const result: Result<T> = CatalogRunner.isResult<T>(response.data)
                ? response.data
                : { value: null as T, hasError: false, errors: [], infos: [] };

            if (result.hasError) {
                await CatalogRunner.handleErrorCallbacks<T>(
                    {
                        status: response.status,
                        result,
                        messages: result.errors,
                    },
                    options
                );
            } else {
                await options.onSuccess?.(result.value);
            }
            return result;
        } catch (e) {
            if (!(e instanceof HttpClientError)) throw e;

            const result = CatalogRunner.isResult<T>(e.data) ? e.data : null;
            const callError: CatalogError<T> = {
                status: e.status,
                result,
                messages: result?.errors ?? [{ message: `HTTP ${e.status}` }],
            };
            await CatalogRunner.handleErrorCallbacks<T>(callError, options);
            return (
                result ?? {
                    value: null as T,
                    hasError: true,
                    errors: callError.messages,
                    infos: [],
                }
            );
        }
    }

    private static async handleErrorCallbacks<T>(error: CatalogError<T>, options: CatalogCallbacks<T>): Promise<void> {
        if (error.result?.errors && options.onReference)
            for (const msg of error.result.errors)
                if (msg.reference && options.onReference[msg.reference])
                    await options.onReference[msg.reference]?.(msg, error);

        if (options.onStatus?.[error.status]) {
            await options.onStatus[error.status]?.(error);
        }
        if (options.onError) {
            await options.onError(error);
        }
    }

    private static isResult<T>(value: unknown): value is Result<T> {
        return (
            typeof value === 'object' && value !== null && 'hasError' in value && 'errors' in value && 'infos' in value
        );
    }
}
