/**
 * Safely parses a JSON string.
 */
export function safeParse<T>(str: string, callBack?: (str: string, err: Error) => void): T | null {
    try {
        return JSON.parse(str);
    } catch (e) {
        callBack?.(str, e as Error);
        return null;
    }
}
