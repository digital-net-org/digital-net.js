import type { Result, ResultMessage } from '../../Result';

export interface CatalogError<T = unknown> {
    /** HTTP status code returned by the server. */
    status: number;
    /** Parsed Result payload if the server returned one. null for network errors or empty 4xx bodies. */
    result: Result<T> | null;
    /** Convenience: either `result.errors` or a synthetic single-message array built from the HTTP status. Never empty when hasError. */
    messages: ResultMessage[];
}
