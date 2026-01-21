import { describe, it, expect } from 'vitest';
import { HTMLResult } from './HTMLResult.js';
import { HTMLParser } from './HTMLParser.js';
import { html } from './html.js';

/**
 * @param {string} output
 * @param {number} index
 */
const expectBindingAttribute = (output, index) =>
    expect(output).toContain(`${HTMLParser.bindingAttributePrefix}${index}`);

/**
 * @param {HTMLElement} element
 * @param {number} index
 */
const expectNoBindingAttribute = (element, index) =>
    expect(element.hasAttribute(`${HTMLParser.bindingAttributePrefix}${index}`)).toBe(false);

describe('html tagged template - HTMLResult instantiation', () => {
    it('should return an instance of HTMLResult', () => {
        const result = html`<div></div>`;
        expect(result).toBeInstanceOf(HTMLResult);
    });

    it('should render static HTML correctly', () => {
        const result = html`<div class="test">Hello</div>`;
        expect(result.toString()).toBe('<div class="test">Hello</div>');
    });

    it('should escape dangerous strings (XSS protection)', () => {
        const dangerous = '<img src="" alt="" onerror=alert(1)>';
        const result = html`<div>${dangerous}</div>`;

        const output = result.toString();
        expect(output).toContain('<div>&lt;img src=&quot;&quot; alt=&quot;&quot; onerror=alert(1)&gt;</div>');
        expect(output).not.toContain('<img');
    });

    it('should support nested HTMLResult (recursion)', () => {
        const inner = html`<span>World</span>`;
        const result = html`<div>Hello ${inner}</div>`;
        expect(result.toString()).toBe('<div>Hello <span>World</span></div>');
    });

    it('should support arrays of values', () => {
        const items = ['A', 'B'];
        const result = html`<ul>
            ${items.map(i => html`<li>${i}</li>`)}
        </ul>`;

        expect(result.toString().replace(/\s+/g, '').trim()).toBe('<ul><li>A</li><li>B</li></ul>');
    });

    it('should handle null or undefined values by rendering nothing', () => {
        const result = html`<div>${null}${undefined}</div>`;
        expect(result.toString()).toBe('<div></div>');
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
