import { HTMLResult } from './HTMLResult.js';
import { HTMLBindingValue } from './HTMLBindingValue.js';

/** @typedef {{ htmlPart: string; index: number; value: any; }} HTMLResultPart */

export class HTMLParser {
    /**
     * Regular expression to detect special binding attributes.
     * @type {RegExp}
     */
    static bindingAttributeRegex = /[:@]([a-z0-9-]+)=$/i;

    /**
     * Analyzes an HTML part to detect binding attributes and returns the binding details.
     * @param {Object} payload The parameters.
     * @param {string} payload.part The HTML part to analyze.
     * @param {number} payload.index The index of the current value in the template.
     * @param {any} payload.value The value to bind.
     * @throws {DigitalComponentError} Throws if the binding attribute is malformed.
     * @returns {HTMLBindingValue} The detected bindings built as HTMLBindingValue.
     */
    static buildBindingValue({ part, index, value }) {
        const match = part.match(HTMLParser.bindingAttributeRegex);
        let type = /** @type BindingType */ null;
        let name = /** @type {string | null} */ null;

        if (match) {
            type = part.slice(match.index, match.index + 1) === '@' ? 'event' : 'prop';
            name = match[1];
        } else if (value instanceof HTMLResult) {
            type = 'html';
        } else {
            type = 'node';
        }

        return new HTMLBindingValue({ type, name, value, index });
    }

    /**
     * Escapes special HTML characters and validates HTMLResult instances.
     * @param value
     * @returns {any}
     */
    static escapeHtmlPart(value) {
        if (value === undefined || value === null) {
            return String(value);
        }
        if (value instanceof HTMLResult) {
            return value.toString();
        }
        if (Array.isArray(value)) {
            return value.map(v => HTMLParser.escapeHtmlPart(v)).join('');
        }
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
