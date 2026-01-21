import { describe, it, expect } from 'vitest';
import { HTMLBindingValue } from './HTMLBindingValue.js';
import { HTMLResult } from './HTMLResult.js';
import { html } from './html.js';

/**
 * @param {string} output
 * @param {number} index
 */
const expectBindingAttribute = (output, index) =>
    expect(output).toContain(`${HTMLBindingValue.bindingPlaceholderPrefix}${index}`);

/**
 * @param {HTMLElement} element
 * @param {number} index
 */
const expectNoBindingAttribute = (element, index) =>
    expect(element.hasAttribute(`${HTMLBindingValue.bindingPlaceholderPrefix}${index}`)).toBe(false);

describe('html tagged template - HTMLResult instantiation', () => {
    it('should return an instance of HTMLResult', () => {
        const result = html`<div></div>`;
        expect(result).toBeInstanceOf(HTMLResult);
    });

    it('should render static HTML correctly', () => {
        const result = html`<div class="test">Hello</div>`;
        expect(result.toString()).toBe('<div class="test">Hello</div>');
    });

    it('should place html comment with data binding id on Text value', () => {
        /**
         * FIXME
         *      Expected: "<div><!--data-b-0--></div>"
         *      Received: "<!--data-b-0--></div>"
         */
        const result = html`<div>${null}</div>`;
        expect(result.toString()).toBe('<div><!--data-b-0--></div>');
    });
});

describe('html tagged template - Bindings & Hydration', () => {
    it('should generate deterministic data-binding-index for events', () => {
        const result = html`<button @click=${() => void 0}>Click</button>`;
        expectBindingAttribute(result.toString(), 0);
        expect(result.toString()).not.toContain('@click');
    });

    it('should generate deterministic data-binding-index for properties', () => {
        const result = html`<input :value=${'test-value'} />`;
        expectBindingAttribute(result.toString(), 0);
        expect(result.toString()).not.toContain(':value');
    });

    it('should hydrate event listeners correctly', () => {
        let clicked = false;
        const handler = () => (clicked = true);
        const result = html`<button @click=${handler}>Click</button>`;

        const container = document.createElement('div');
        container.innerHTML = result.toString();
        result.hydrate(container);

        const button = container.querySelector('button');
        button.click();

        expect(clicked).toBe(true);
    });

    it('should hydrate properties correctly', () => {
        const val = 'Hello World';
        const result = html`<input :value=${val} />`;

        const container = document.createElement('div');
        container.innerHTML = result.toString();
        result.hydrate(container);

        const input = container.querySelector('input');
        expect(input.value).toBe(val);
    });

    it('should remove data-binding-index attributes after hydration', () => {
        const result = html`<button data-theme="light" :value=${1} @click=${() => void 0}>Click</button>`;

        const container = document.createElement('div');
        container.innerHTML = result.toString();
        result.hydrate(container);
        const button = container.querySelector('button');
        expectNoBindingAttribute(button, 0);
        expectNoBindingAttribute(button, 1);
    });
});
