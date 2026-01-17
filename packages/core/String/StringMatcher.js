/**
 * Utility class to validate string patterns and formats.
 */
export class StringMatcher {
    /**
     * Checks if a string is null, undefined, or empty.
     * @param {string | undefined} str
     * @returns {boolean}
     */
    static isEmpty(str) {
        return !str || str.length === 0;
    }

    /**
     * Checks if a string is null, undefined, empty or whitespace.
     * @param {string | undefined} str
     * @returns {boolean}
     */
    static isEmptyOrWhitespace(str) {
        return !str || str.trim().length === 0;
    }

    /**
     * Checks if a string is in camelCase.
     * @param {string} str
     * @returns {boolean}
     */
    static isCamelCase(str) {
        return /^[a-z]+([A-Z][a-z0-9]*)*$/.test(str);
    }

    /**
     * Checks if a string is in PascalCase.
     * @param {string} str
     * @returns {boolean}
     */
    static isPascalCase(str) {
        return /^[A-Z][a-z0-9]*([A-Z][a-z0-9]*)*$/.test(str);
    }

    /**
     * Checks if a string is in snake_case.
     * @param {string} str
     * @returns {boolean}
     */
    static isSnakeCase(str) {
        return /^[a-z0-9]+(_[a-z0-9]+)*$/.test(str);
    }

    /**
     * Checks if a string is in UPPER_SNAKE_CASE.
     * @param {string} str
     * @returns {boolean}
     */
    static isUpperSnakeCase(str) {
        return /^[A-Z0-9]+(_[A-Z0-9]+)*$/.test(str);
    }
}
