import { DigitalComponentError } from '../Error';

/**
 * Wraps a template and its values to be processed safely.
 */
export class HTMLResult {
    /** @type {string[]} */
    #strings;
    /** @type {any[]} */
    #values;
    /** @type {Map<string, {type: string, name: string; value: any;}>} */
    #bindings = new Map();

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
            const match = str.match(HTMLResult.bindingRegex);
            if (match) {
                const type = str.slice(match.index, match.index + 1) === '@' ? 'event' : 'prop';
                const bindingAttribute = `${HTMLResult.bindingAttributePrefix}${i}`;
                const name = match[1];

                if (type === 'event' && typeof value !== 'function') {
                    throw new DigitalComponentError(
                        `HTMLResult: Event binding for '${name}' must be a function, received '${typeof value}'.`,
                        'HTMLResult.toString'
                    );
                }
                if (type === 'prop' && (typeof value === 'function' || value instanceof HTMLResult)) {
                    throw new DigitalComponentError(
                        `HTMLResult: Property binding for '${name}' cannot be a function or HTMLResult instance, received '${typeof value}'.`,
                        'HTMLResult.toString'
                    );
                }

                this.#bindings.set(bindingAttribute, { type, name, value });
                return acc + str.replace(HTMLResult.bindingRegex, bindingAttribute);
            }

            return acc + str + this.#escape(value);
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

    /**
     * Escapes special HTML characters and validates HTMLResult instances.
     * @param value
     * @returns {any}
     */
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
