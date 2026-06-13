import type { Result } from '../Result';

/**
 * Resolve a Result value from an unknown object
 **/
export function unwrapResult<T>(body: unknown): T | undefined {
    if (body && typeof body === 'object' && 'value' in body && 'hasError' in body) {
        return (body as Result<T>).value;
    }
    return body as T | undefined;
}
