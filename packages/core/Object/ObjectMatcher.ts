/**
 * Collection of functions to compare objects
 */
export class ObjectMatcher {
    private static buildObject = (obj: any, ignoreKeys?: Array<string>) => {
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
     * Verify if one or more objects are of type object
     * @param obj - objects to verify
     * @returns true if object is of type object
     */
    public static isObject(...obj: any): boolean {
        for (const object of obj) {
            if (!object || typeof object !== 'object') {
                return false;
            }
        }
        return true;
    }

    /**
     * Verify if a value is an empty object
     * @param obj - Object to verify
     * @return true if it is an empty object
     */
    public static isEmptyObject(obj: any): boolean {
        return Boolean(obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0);
    }

    /**
     * Verify if one or more objects are null
     * @param obj - objects to verify
     * @returns true if object is null
     */
    public static isNull(...obj: any): boolean {
        for (const object of obj) {
            if (object !== null) {
                return false;
            }
        }
        return true;
    }

    /**
     * Verify if one or more objects are undefined
     * @param obj - objects to verify
     * @returns true if object is undefined
     */
    public static isUndefined(...obj: any): boolean {
        for (const object of obj) {
            if (object !== undefined) {
                return false;
            }
        }
        return true;
    }

    /**
     * Compare two objects by type
     * @param a - first object
     * @param b - second object
     * @returns true if both objects are of the same type
     */
    public static typeEquality(a: any, b: any): boolean {
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
     * @param a - first object
     * @param b - second object
     * @param ignoreKeys - keys to ignore (optional)
     * @returns true if both objects have the same keys
     */
    public static objectKeysEquality(a: any, b: any, ignoreKeys?: Array<string>): boolean {
        if (!this.isObject(a, b) || !this.typeEquality(a, b)) {
            return false;
        }
        const objectA = this.buildObject(a, ignoreKeys);
        const objectB = this.buildObject(b, ignoreKeys);

        if (Object.keys(objectA).length !== Object.keys(objectB).length) {
            return false;
        }

        for (const key of Object.keys(objectA)) {
            if (!Object.keys(objectB).includes(key)) {
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
     * @param a - first object
     * @param b - second object
     * @param ignoreKeys - keys to ignore (optional)
     * @returns true if both objects are equal
     */
    public static deepEquality<T>(
        a: T | Partial<T> | undefined | null,
        b: T | Partial<T> | undefined | null,
        ignoreKeys?: Array<keyof T>
    ) {
        if (!this.isObject(a, b)) {
            return this.typeEquality(a, b);
        }
        if (!this.objectKeysEquality(a, b, ignoreKeys as string[])) {
            return false;
        }

        const objectA = this.buildObject(a, ignoreKeys as string[]);
        const objectB = this.buildObject(b, ignoreKeys as string[]);

        for (const key of Object.keys(objectA)) {
            if (!this.isObject(objectA[key], objectB[key])) {
                if (objectA[key] !== objectB[key]) {
                    return false;
                }
            } else if (!this.deepEquality(objectA[key], objectB[key], ignoreKeys)) {
                return false;
            }
        }

        return true;
    }
}
