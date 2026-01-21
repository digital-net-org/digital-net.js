import { HTMLParser } from './HTMLParser.js';

/** @typedef {{type: string, name: string; value: any;}} Binding */

/**
 * Wraps a template and its values to be processed safely.
 */
export class HTMLResult {
    /** @type {string[]} */
    #strings;
    /** @type {any[]} */
    #values;
    /** @type {Map<string, Binding>} */
    #bindings = new Map();

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
            const binding = HTMLParser.getBindingAttribute(str, i);

            if (binding) {
                HTMLParser.validateBinding(binding, value);
                this.#bindings.set(binding.attribute, { type: binding.type, name: binding.name, value });
                return acc + str.replace(HTMLParser.bindingRegex, binding.attribute);
            }

            return acc + str + HTMLParser.escapeHtmlPart(value);
        }, '');
    }

    /**
     * Hydrates the bindings into the provided root element.
     * @param {ShadowRoot | HTMLElement} root
     */
    hydrate(root) {
        this.#bindings.forEach((binding, attribute) => {
            const element = root.querySelector(`[${attribute}]`);
            if (!element) {
                return;
            }
            if (binding.type === 'event') {
                element.addEventListener(binding.name, binding.value);
            } else {
                element[binding.name] = binding.value;
            }
            element.removeAttribute(attribute);
        });
    }
}
