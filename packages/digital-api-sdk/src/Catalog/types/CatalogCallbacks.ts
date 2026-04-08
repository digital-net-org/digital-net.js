import type { ResultMessage } from '../../types';
import type { CatalogError } from './CatalogError';

export interface CatalogCallbacks<T = unknown> {
    /** Invoked on 2xx responses when the parsed Result is not an error. `value` is `result.value`. */
    onSuccess?: (_value: T) => void | Promise<void>;
    /** Generic fallback invoked on any HTTP error (4xx/5xx) with or without a Result body. Not called on network errors. */
    onError?: (_error: CatalogError<T>) => void | Promise<void>;
    /** Invoked when the server returns a specific HTTP status code. Called in addition to onError and onReference. */
    onStatus?: Partial<Record<number, (_error: CatalogError<T>) => void | Promise<void>>>;
    /**
     * Invoked once per matching `ResultMessage.reference` in `result.errors`.
     * Lets the caller react to specific .NET exception types (e.g., INVALID_CREDENTIALS_EXCEPTION).
     * Called in addition to onStatus and onError.
     */
    onReference?: Partial<Record<string, (_message: ResultMessage, _error: CatalogError<T>) => void | Promise<void>>>;
}
