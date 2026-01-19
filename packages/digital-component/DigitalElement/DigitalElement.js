import { StringResolver } from '../../core/String';
import { DigitalComponentError } from '../Error';
import { CSSResult } from '../styles/CSSResult';
import { HTMLResult } from '../html/HTMLResult.js';
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
            throw new DigitalComponentError(
                'Cannot instantiate abstract class Component directly. This class must be extended',
                'DigitalElement.constructor'
            );
        }

        const style = this.renderStyle();
        if (style && !(style instanceof CSSResult)) {
            throw new DigitalComponentError(
                `${this.constructor.name}: renderStyle() must return an instance of CSSResult. Use the 'css' tagged template function.`,
                'DigitalElement.constructor'
            );
        }

        this.constructor._tagName ??= StringResolver.toKebabCase(this.constructor.name);
        this.constructor._styleTemplateId ??= `${this.constructor._tagName}-style`;

        // SSR Declarative Shadow DOM case (see https://web.dev/articles/declarative-shadow-dom#component_hydration)
        if (this.shadowRoot) {
            // The shadowRoot is already populated by the browser and the style is already in the DOM.
            // We just need to adopt the stylesheet if possible and clean up the existing styles.
            // HTML template should already be in place as well.
            if (style instanceof CSSResult && Array.isArray(this.shadowRoot.adoptedStyleSheets)) {
                this.shadowRoot.adoptedStyleSheets = [style.styleSheet];
                const ssrStyle = this.shadowRoot.querySelector(`#${this.constructor._styleTemplateId}`);
                if (ssrStyle) {
                    ssrStyle.remove();
                }
            }
            return;
        }

        if (typeof window?.document?.createElement !== 'function') {
            throw new DigitalComponentError(
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

            const htmlContent = this.render();
            if (!(htmlContent instanceof HTMLResult)) {
                throw new DigitalComponentError(
                    `${this.constructor.name}: render() must return an instance of HTMLResult. Use the 'html' tagged template function.`,
                    'DigitalElement.constructor'
                );
            }

            const styleContent = !hasAdoptedStyles
                ? `<style id="${this.constructor._styleTemplateId}">${style.toString()}</style>`
                : '';

            template.innerHTML = `${styleContent}${htmlContent.toString()}`;
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
            throw new DigitalComponentError(
                'Cannot append abstract class digitalElement directly. This class must be extended.',
                'DigitalElement.define'
            );
        }
        if (typeof window?.customElements?.define !== 'function') {
            throw new DigitalComponentError(
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
     * @returns {HTMLResult} The string containing the HTML content.
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
