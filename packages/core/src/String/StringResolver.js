import { StringMatcher } from './StringMatcher.js';

/**
 * Utility class to resolve, transform or format strings.
 */
export class StringResolver {
    /**
     * Removes slashes from the beginning and end of the string.
     * @param {string} str
     * @returns {string}
     */
    static trimSlashes(str) {
        if (StringMatcher.isEmptyOrWhitespace(str)) return '';
        return str.replace(/^\/|\/$/g, '');
    }

    /**
     * Converts a string to camel case from various formats.
     * @param {string} str
     * @returns {string}
     */
    static toCamelCase(str) {
        if (StringMatcher.isEmptyOrWhitespace(str)) return '';
        if (StringMatcher.isCamelCase(str)) return str;
        if (StringMatcher.isPascalCase(str)) return str[0].toLowerCase() + str.slice(1);

        if (StringMatcher.isSnakeCase(str) || StringMatcher.isUpperSnakeCase(str)) {
            return str.toLowerCase().replace(/_([a-z0-9])/g, (_, chr) => chr.toUpperCase());
        }
        if (StringMatcher.isKebabCase(str)) {
            return str.toLowerCase().replace(/-([a-z0-9])/g, (_, chr) => chr.toUpperCase());
        }

        console.warn(`StringResolver.toCamelCase(), Could not convert string to camel case: ${str}`);
        return str;
    }

    /**
     * Converts any string to kebab-case.
     * Handles PascalCase, camelCase, snake_case, and strings with spaces or symbols.
     * @param {string} str
     * @returns {string}
     */
    static toKebabCase(str) {
        if (StringMatcher.isEmptyOrWhitespace(str)) return '';
        if (StringMatcher.isKebabCase(str)) return str;

        return str
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-');
    }

    /**
     * Truncate a string that exceeds the provided length and adds ellipsis.
     * @param {string} input
     * @param {number} maxLength
     * @returns {string}
     */
    static truncateWithEllipsis(input, maxLength) {
        if (StringMatcher.isEmptyOrWhitespace(input)) return '';
        const ellipsis = '...';
        if (input.length <= maxLength) {
            return input;
        }
        if (maxLength - 3 < 3) {
            return ellipsis;
        }
        return input.slice(0, maxLength - 3) + ellipsis;
    }
}
