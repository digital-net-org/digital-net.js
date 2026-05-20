/**
 * Utility class to validate and build safe regular expressions.
 */
export class StringValidation {
    /**
     * Builds an anchored RegExp from a raw pattern source. The pattern is wrapped
     * in `^(?:...)$` to enforce full-string matching, mirroring the behaviour of
     * the HTML5 `pattern` attribute. Returns `undefined` when the input is empty
     * or cannot be compiled (invalid syntax).
     * @param {string | null | undefined} pattern
     * @returns {RegExp | undefined}
     */
    static buildSafeRegex(pattern) {
        if (!pattern) return undefined;
        try {
            return new RegExp(`^(?:${pattern})$`);
        } catch {
            return undefined;
        }
    }
}
