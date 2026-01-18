import { StringResolver } from '../../../core/String';

/**
 * Base class for all Digital UI components.
 * Provides static template caching and automatic registration.
 */
export class DigitalElement extends HTMLElement {
    /** @type {Map<Function, HTMLTemplateElement>} */
    static #templates = new Map();

    constructor() {
        super();
        if (this.constructor === DigitalElement) {
            throw new TypeError('Cannot instantiate abstract class DigitalElement directly.');
        }
        if (typeof window?.document?.createElement !== 'function') {
            throw new TypeError('Cannot create a template in the current environment.');
        }
        if (!DigitalElement.#templates.has(this.constructor)) {
            const template = document.createElement('template');
            const html = this.render();
            const css = this.renderStyle();
            template.innerHTML = `<style>${css}</style>${html}`;
            DigitalElement.#templates.set(this.constructor, template);
        }

        const cachedTemplate = DigitalElement.#templates.get(this.constructor);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(cachedTemplate.content.cloneNode(true));
    }

    connectedCallback() {}

    /**
     * Registers the custom element.
     * @param {string | undefined | null} [tagName] Optional tag name, defaults to kebab-case class name.
     * @throws {Error} Throws an error if `window.customElements.define` is not defined.
     * @throws {TypeError} Throws if the class is not inherited.
     */
    static define(tagName = null) {
        if (this === DigitalElement) {
            throw new TypeError('Cannot append abstract class digitalElement directly.');
        }
        if (typeof window?.customElements?.define !== 'function') {
            throw new Error('Cannot define customElements in the current environment');
        }

        const resolvedName = tagName ?? StringResolver.toKebabCase(this.name);
        if (!window.customElements.get(resolvedName)) {
            window.customElements.define(resolvedName, this);
        }
    }

    /**
     * Render the HTML content of the custom Element.
     * @abstract
     * @returns {string} The string containing the HTML content.
     */
    render() {
        throw new Error(`${this.constructor.name}: You must implement render()`);
    }

    /**
     * Render the Style sheet of the custom Element.
     * @virtual
     * @returns {string} The string containing the CSS content.
     */
    renderStyle() {
        return '';
    }
}
