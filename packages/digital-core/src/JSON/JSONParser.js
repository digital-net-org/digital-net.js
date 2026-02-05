/**
 * Utility class that handles JSON string parsing
 */
export class JSONParser {
    /**
     * @template T
     * @param {string} str
     * @param {function(string, Error): void} [callBack] Callback to execute on error
     * @returns {T | null}
     */
    static safeParse(str, callBack) {
        try {
            return JSON.parse(str);
        } catch (e) {
            callBack?.(str, e);
            return null;
        }
    }
}
