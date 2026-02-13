import { HTMLBindingValue } from './HTMLBindingValue.js';
import { HTMLParser } from './HTMLParser.js';
import { DigitalComponentError } from '../Error';

/**
 * Wraps a template and its values to be processed safely.
 */
export class HTMLResult {
    /**
     * A deterministic id based on the content of the stringified template.
     * @type {string | null}
     */
    #id = null;
    /**
     * html function result strings.
     * @type {string[]}
     */
    #strings;
    /**
     * Bindings detected in the template.
     * @type {Map<string, HTMLBindingValue>}
     */
    #bindings = new Map();
    /**
     * References to the hydrated nodes.
     * @type {Map<string, HTMLElement | ChildNode | Text>}
     */
    #refs = new Map();
    /**
     * Child HTMLResult templates.
     * @type {Map<string, HTMLResult>}
     */
    #children = new Map();

    /**
     * Values associated with the template.
     * @type {any[]}
     */
    values;

    constructor(strings, values) {
        this.#strings = strings;
        this.values = values;
        this.#id = `${(strings ?? []).join('')}${(values ?? []).length}`;
    }

    /**
     * A deterministic id based on the content of the stringified template.
     * @returns {string}
     */
    get id() {
        return this.#id;
    }

    /**
     * Converts the HTMLResult to a string, processing bindings.
     * @returns {string} The processed HTML string.
     * @throws {DigitalComponentError} Throws if an unknown binding type is detected.
     */
    toString() {
        return this.#strings.reduce((acc, part, index) => {
            if (index >= this.values.length) {
                return acc + part;
            }

            const value = this.values[index];
            const binding = HTMLParser.buildBindingValue({ part, index, value });
            if (!binding) {
                return acc + part;
            }
            this.#bindings.set(binding.id, binding);

            if (binding.type === 'prop' || binding.type === 'event') {
                return acc + part.replace(HTMLParser.bindingAttributeRegex, binding.placeholder);
            }
            if (binding.type === 'node') {
                return acc + part + binding.placeholder;
            }
            if (binding.type === 'html') {
                return acc + part + binding.placeholder;
            }

            throw new DigitalComponentError('Unknown binding type detected.', 'HTMLResult.toString');
        }, '');
    }

    /**
     * Gets the node markers of the first rendering.
     * @param {ShadowRoot | HTMLElement} root
     * @returns {Map<string, HTMLElement>}
     */
    getNodeMarkers(root) {
        console.log(root);
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
        let comment;
        const markers = new Map();
        while ((comment = walker.nextNode())) {
            if (comment.data.startsWith(HTMLBindingValue.bindingPlaceholderPrefix)) {
                markers.set(comment.data, comment);
            }
        }
        return markers;
    }

    /**
     * Hydrates the bindings into the provided root element.
     * @param {ShadowRoot | HTMLElement} root
     */
    hydrate(root) {
        const markers = this.getNodeMarkers(root);
        this.#bindings.forEach((binding, id) => {
            if (binding.type === 'node' || binding.type === 'html') {
                const marker = markers.get(id);
                if (!marker) {
                    throw new DigitalComponentError(
                        `HTMLResult: Unable to find marker for binding '${binding.id}' in the provided root element.`,
                        'HTMLResult.hydrate'
                    );
                }
                if (binding.type === 'node') {
                    const textNode = document.createTextNode(HTMLParser.escapeHtmlPart(binding.value));
                    marker.parentNode.insertBefore(textNode, marker);
                    this.#refs.set(id, textNode);
                }
                if (binding.type === 'html') {
                    const template = document.createElement('template');
                    /**
                     *  FIXME:
                     *      Each component instance will creates its own nodes map, which can be memory intensive.
                     *      A better approach would be to have a shared nodes map for all instances of the same component,
                     *      like how templates are cached in the component class.
                     */
                    template.innerHTML = binding.value.toString();
                    const node = template.firstChild;
                    binding.value.hydrate(node);
                    marker.parentNode.insertBefore(node, marker);
                    this.#refs.set(id, node);
                }
            } else {
                const element = root.querySelector(`[${id}]`);
                if (!element) {
                    return;
                }
                this.#refs.set(id, element);
                if (binding.type === 'event') {
                    element.addEventListener(binding.name, binding.value);
                }
                if (binding.type === 'prop') {
                    element[binding.name] = binding.value;
                }
                element.removeAttribute(binding.placeholder);
            }
        });
    }

    /**
     * Patches the current values with new values.
     * @param {any[]} payload
     */
    patch(payload) {
        this.#bindings.forEach((binding, id) => {
            const node = this.#refs.get(id);
            if (!node) {
                return;
            }

            const newValue = payload[binding.index];
            const oldValue = this.values[binding.index];

            if (newValue === oldValue) {
                return;
            }
            if (binding.type === 'html') {
                const template = document.createElement('template');
                template.innerHTML = newValue.toString();
                const newNode = template.firstChild;
                newValue.hydrate(newNode);
                node.parentNode.replaceChild(newNode, node);
                this.#refs.set(id, newNode);
            }
            if (binding.type === 'node') {
                node.textContent = HTMLParser.escapeHtmlPart(newValue);
                return;
            }
            if (binding.type === 'prop') {
                node[binding.name] = newValue;
            }
            // Events (@) are not patched has they are assumed to be stable functions
        });
        this.values = payload;
    }
}
