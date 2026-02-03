import { describe, it, expect } from 'vitest';
import { HTMLParser } from './HTMLParser.js';
import { HTMLResult } from './HTMLResult.js';

describe('HTMLParser', () => {
    describe('buildBindingValue()', () => {
        it('should return node if no binding is found', () => {
            const result = HTMLParser.buildBindingValue({ part: '', value: null, index: 1 }).type;
            expect(result).toBe('node');
        });

        it('should detect event bindings (@)', () => {
            const result = HTMLParser.buildBindingValue({
                part: '<button @click=',
                value: () => void 0,
                index: 0,
            }).type;
            expect(result).toBe('event');
        });

        it('should detect property bindings (:)', () => {
            const result = HTMLParser.buildBindingValue({
                part: '<input :value=',
                value: 'test',
                index: 42,
            }).type;
            expect(result).toBe('prop');
        });
    });

    describe('escapeHtmlPart()', () => {
        it('should return null or undefined values as string', () => {
            expect(HTMLParser.escapeHtmlPart(null)).toBe('null');
            expect(HTMLParser.escapeHtmlPart(undefined)).toBe('undefined');
        });

        it('should escape dangerous characters', () => {
            const input = '<div class="test">&\'</div>';
            const expected = '&lt;div class=&quot;test&quot;&gt;&amp;&#39;&lt;/div&gt;';
            expect(HTMLParser.escapeHtmlPart(input)).toBe(expected);
        });

        it('should handle nested HTMLResult', () => {
            const nested = new HTMLResult(['<span>hi</span>'], []);
            expect(HTMLParser.escapeHtmlPart(nested)).toBe('<span>hi</span>');
        });

        it('should handle arrays and escape each element', () => {
            const list = ['<a>', '<b>'];
            expect(HTMLParser.escapeHtmlPart(list)).toBe('&lt;a&gt;&lt;b&gt;');
        });
    });
});
