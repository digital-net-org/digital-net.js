/**
 * Collection of functions to compare objects
 */
export class ObjectMatcher {
    /**
     * @param {any} obj
     * @param {string[]} [ignoreKeys]
     * @returns {any}
     */
    static #buildObject = (obj, ignoreKeys) => {
        if (!this.isObject(obj) || !ignoreKeys || !ignoreKeys.length) {
            return obj;
        }
        const object = { ...obj };
        for (const key of ignoreKeys) {
            delete object[key];
        }
        return object;
    };

    /**
     * Verify if one or more objects are of type `object`
     * @param {...any} obj - objects to verify
     * @returns {boolean}
     */
    static isObject(...obj) {
        for (const object of obj) {
            if (!object || typeof object !== 'object') {
                return false;
            }
        }
        return true;
    }

    /**
     * Verify if a value is an empty object
     * @param {any} obj - Object to verify
     * @returns {boolean}
     */
    static isEmptyObject(obj) {
        return Boolean(obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0);
    }

    /**
     * Verify if one or more objects are null
     * @param {...any} obj - objects to verify
     * @returns {boolean}
     */
    static isNull(...obj) {
        for (const object of obj) {
            if (object !== null) {
                return false;
            }
        }
        return true;
    }

    /**
     * Verify if one or more objects are undefined
     * @param {...any} obj - objects to verify
     * @returns {boolean}
     */
    static isUndefined(...obj) {
        for (const object of obj) {
            if (object !== undefined) {
                return false;
            }
        }
        return true;
    }

    /**
     * Compare two objects by type
     * @param {any} a - first object
     * @param {any} b - second object
     * @returns {boolean}
     */
    static typeEquality(a, b) {
        if ((this.isNull(a) && !this.isNull(b)) || (!this.isNull(a) && this.isNull(b))) {
            return false;
        }
        if ((this.isUndefined(a) && !this.isUndefined(b)) || (!this.isUndefined(a) && this.isUndefined(b))) {
            return false;
        }
        return typeof a === typeof b;
    }

    /**
     * Compare two objects by keys
     * @param {any} a - first object
     * @param {any} b - second object
     * @param {string[]} [ignoreKeys] - keys to ignore
     * @returns {boolean}
     */
    static objectKeysEquality(a, b, ignoreKeys) {
        if (!this.isObject(a, b) || !this.typeEquality(a, b)) {
            return false;
        }
        const objectA = this.#buildObject(a, ignoreKeys);
        const objectB = this.#buildObject(b, ignoreKeys);

        const keysA = Object.keys(objectA);
        const keysB = Object.keys(objectB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (const key of keysA) {
            if (!keysB.includes(key)) {
                return false;
            }
            if (!this.isObject(objectA[key], objectB[key])) {
                continue;
            }
            if (!this.objectKeysEquality(objectA[key], objectB[key], ignoreKeys)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Compare two objects by value
     * @template T
     * @param {T | Partial<T> | undefined | null} a
     * @param {T | Partial<T> | undefined | null} b
     * @param {string[]} [ignoreKeys]
     * @returns {boolean}
     */
    static deepEquality(a, b, ignoreKeys) {
        if (!this.isObject(a, b)) {
            return a === b;
        }
        if (!this.objectKeysEquality(a, b, ignoreKeys)) {
            return false;
        }

        const objectA = this.#buildObject(a, ignoreKeys);
        const objectB = this.#buildObject(b, ignoreKeys);

        for (const key of Object.keys(objectA)) {
            const valA = objectA[key];
            const valB = objectB[key];

            if (!this.isObject(valA, valB)) {
                if (valA !== valB) {
                    return false;
                }
            } else if (!this.deepEquality(valA, valB, ignoreKeys)) {
                return false;
            }
        }

        return true;
    }
}
