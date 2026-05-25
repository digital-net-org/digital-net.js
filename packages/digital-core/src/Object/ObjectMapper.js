/**
 * Utility class for structural object transforms. Runtime equivalents of the
 * TypeScript `Pick` and `Omit` utility types.
 */
export class ObjectMapper {
    /**
     * Returns a new object containing only the provided keys.
     * Runtime equivalent of TypeScript's `Pick<T, K>`. Keys absent from the
     * source object are skipped.
     * @template {object} T
     * @template {keyof T} K
     * @param {T} obj - The source object.
     * @param {readonly K[]} keys - The keys to keep.
     * @returns {Pick<T, K>} A new object with only the picked keys.
     */
    static pick(obj, keys) {
        const result = {};
        for (const key of keys) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = obj[key];
            }
        }
        return result;
    }

    /**
     * Returns a new object without the provided keys.
     * Runtime equivalent of TypeScript's `Omit<T, K>`.
     * @template {object} T
     * @template {keyof T} K
     * @param {T} obj - The source object.
     * @param {readonly K[]} keys - The keys to drop.
     * @returns {Omit<T, K>} A new object without the omitted keys.
     */
    static omit(obj, keys) {
        const excluded = new Set(keys);
        const result = {};
        for (const key of Object.keys(obj)) {
            if (!excluded.has(key)) {
                result[key] = obj[key];
            }
        }
        return result;
    }
}
