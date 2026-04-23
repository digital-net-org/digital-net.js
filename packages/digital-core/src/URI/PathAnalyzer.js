const DYNAMIC_SLUG_REGEX = /:[a-zA-Z_]\w*/;

/**
 * Utility class for analyzing URL paths: detecting dynamic slugs, etc.
 */
export class PathAnalyzer {
    /**
     * Returns true when the given path contains at least one dynamic slug
     * (e.g. `:id` in `/articles/:id`). A slug must start with a letter or
     * underscore and may contain alphanumerics or underscores.
     * @param {string | null | undefined} path
     * @returns {boolean}
     */
    static hasDynamicSlug(path) {
        if (typeof path !== 'string' || path.length === 0) return false;
        return DYNAMIC_SLUG_REGEX.test(path);
    }
}
