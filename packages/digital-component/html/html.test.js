import { describe, it, expect } from 'vitest';
import { HTMLResult } from './HTMLResult.js';
import { html } from './html.js';

describe('html tagged template', () => {
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
