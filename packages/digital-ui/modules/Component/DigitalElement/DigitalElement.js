import { StringResolver } from '../../../../core/String';
import { DigitalUiError } from '../../Error';
import { CSSResult } from '../styles/CSSResult';
import { css } from '../styles/css';

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
            throw new DigitalUiError(
                'Cannot instantiate abstract class Component directly. This class must be extended',
                'DigitalElement.constructor'
            );
        }

        const style = this.renderStyle();
        if (style && !(style instanceof CSSResult)) {
            throw new DigitalUiError(
                `${this.constructor.name}: renderStyle() must return an instance of CSSResult. Use the 'css' tagged template function.`,
                'DigitalElement.constructor'
            );
        }

        // SSR Declarative Shadow DOM case (see https://web.dev/articles/declarative-shadow-dom#component_hydration)
        if (this.shadowRoot) {
            // The shadowRoot is already populated by the browser and the style is already in the DOM.
            // We just need to adopt the stylesheet if possible and clean up the existing styles.
            // HTML template should already be in place as well.
            if (style instanceof CSSResult && Array.isArray(this.shadowRoot.adoptedStyleSheets)) {
                this.shadowRoot.adoptedStyleSheets = [style.styleSheet];
                const ssrStyle = this.shadowRoot.querySelector('style');
                if (ssrStyle) {
                    ssrStyle.remove();
                }
            }

            return;
        }

        // CSR case
        if (typeof window?.document?.createElement !== 'function') {
            throw new DigitalUiError(
                'Cannot create a template in the current environment.',
                'DigitalElement.constructor'
            );
        }

        this.attachShadow({ mode: 'open' });

        const hasAdoptedStyles = style instanceof CSSResult && Array.isArray(this.shadowRoot.adoptedStyleSheets);
        if (hasAdoptedStyles) {
            this.shadowRoot.adoptedStyleSheets = [style.styleSheet];
        }

        if (!DigitalElement.#templates.has(this.constructor)) {
            const template = document.createElement('template');
            template.innerHTML = (!hasAdoptedStyles ? `<style>${style.toString()}</style>` : '') + this.render();
            DigitalElement.#templates.set(this.constructor, template);
        }

        const cachedTemplate = DigitalElement.#templates.get(this.constructor);
        this.shadowRoot.appendChild(cachedTemplate.content.cloneNode(true));
    }

    /**
     * Registers the custom element.
     * @param {string | undefined | null} [tagName] Optional tag name, defaults to kebab-case class name.
     * @throws {Error} Throws an error if `window.customElements.define` is not defined.
     * @throws {TypeError} Throws if the class is not inherited.
     */
    static define(tagName = null) {
        if (this === DigitalElement) {
            throw new DigitalUiError(
                'Cannot append abstract class digitalElement directly. This class must be extended.',
                'DigitalElement.define'
            );
        }
        if (typeof window?.customElements?.define !== 'function') {
            throw new DigitalUiError(
                'Cannot define customElements in the current environment',
                'DigitalElement.define'
            );
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
     * @returns {CSSResult} The string containing the CSS content.
     */
    renderStyle() {
        return css``;
    }
}
