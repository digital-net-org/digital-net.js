/**
 * Wraps a template and its values to be processed safely.
 */
export class HTMLResult {
    /** @type {string[]} */
    #strings;
    /** @type {any[]} */
    #values;

    constructor(strings, values) {
        this.#strings = strings;
        this.#values = values;
    }

    /**
     * @returns {string} The processed HTML string.
     */
    toString() {
        return this.#strings.reduce((acc, str, i) => {
            const value = this.#values[i];
            return acc + str + this.#escape(value);
        }, '');
    }

    #escape(value) {
        if (value === undefined || value === null) {
            return '';
        }
        if (value instanceof HTMLResult) {
            return value.toString();
        }
        if (Array.isArray(value)) {
            return value.map(v => this.#escape(v)).join('');
        }

        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
