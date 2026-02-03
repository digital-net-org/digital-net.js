/**
 * Utility class designed to perform mutations on objects,
 * such as cleaning or transforming their structure.
 */
export class ObjectMutator {
    /**
     * Recursively deletes all entries with undefined values.
     * @param {any} obj - The object to clean.
     * @returns {any} A new object without undefined entries.
     */
    static deleteUndefinedEntries(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        const object = Array.isArray(obj) ? [...obj] : { ...obj };

        for (const key of Object.keys(object)) {
            if (typeof object[key] === 'object') {
                object[key] = this.deleteUndefinedEntries(object[key]);
            }
            if (object[key] === undefined) {
                delete object[key];
            }
        }
        return object;
    }
}
