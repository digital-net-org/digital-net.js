import { HTMLResult } from './HTMLResult.js';
import { DigitalComponentError } from '../Error';

/** @typedef {'event' | 'prop'} AttributeBindingType */
/** @typedef {{ type: AttributeBindingType; name: string; attribute: string; }} BindingResult */

export class HTMLParser {
    /**
     * Regular expression to detect special binding attributes.
     * @type {RegExp}
     */
    static bindingRegex = /[:@]([a-z0-9-]+)=$/i;

    /**
     * Binding attributes to resolve template hydration.
     * @type {string}
     */
    static bindingAttributePrefix = 'data-b-';

    /**
     * Analyzes an HTML part to detect binding attributes and returns the binding details.
     * @param {string} part The HTML part to analyze.
     * @param {number} index The index of the current value in the template.
     * @returns {BindingResult | null} The detected bindings.
     */
    static getBindingAttribute(part, index) {
        const match = part.match(HTMLParser.bindingRegex);
        if (!match) {
            return null;
        }

        const type =
            /** @type {AttributeBindingType} */ part.slice(match.index, match.index + 1) === '@' ? 'event' : 'prop';
        const attribute = `${HTMLParser.bindingAttributePrefix}${index}`;
        const name = match[1];

        return { type, name, attribute };
    }

    /**
     * Analyzes a BindingResult and value to validate the binding.
     * @param {BindingResult} binding The binding details.
     * @param {any} value The value to bind.
     * @throws {DigitalComponentError} Throws if the binding is invalid.
     */
    static validateBinding(binding, value) {
        if (binding.type === 'event' && typeof value !== 'function') {
            throw new DigitalComponentError(
                `HTMLParser: Event binding for '${binding.name}' must be a function, received '${typeof value}'.`,
                'HTMLParser.validateBinding'
            );
        }
        if (binding.type === 'prop' && (typeof value === 'function' || value instanceof HTMLResult)) {
            throw new DigitalComponentError(
                `HTMLParser: Property binding for '${binding.name}' cannot be a function or HTMLResult instance, received '${typeof value}'.`,
                'HTMLParser.validateBinding'
            );
        }
    }

    /**
     * Escapes special HTML characters and validates HTMLResult instances.
     * @param value
     * @returns {any}
     */
    static escapeHtmlPart(value) {
        if (value === undefined || value === null) {
            return '';
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
