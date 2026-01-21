import { describe, it, expect } from 'vitest';
import { DigitalComponentError } from '../Error';
import { HTMLParser } from './HTMLParser.js';
import { HTMLResult } from './HTMLResult.js';

describe('HTMLParser', () => {
    describe('getBindingAttribute()', () => {
        it('should return null if no binding is found', () => {
            expect(HTMLParser.getBindingAttribute('<div>')).toBe(null);
            expect(HTMLParser.getBindingAttribute('class="test"')).toBe(null);
        });

        it('should detect event bindings (@)', () => {
            const result = HTMLParser.getBindingAttribute('<button @click=', 0);
            expect(result).toEqual({
                type: 'event',
                name: 'click',
                attribute: 'data-b-0',
            });
        });

        it('should detect property bindings (:)', () => {
            const result = HTMLParser.getBindingAttribute('<input :value=', 42);
            expect(result).toEqual({
                type: 'prop',
                name: 'value',
                attribute: 'data-b-42',
            });
        });
    });

    describe('validateBinding()', () => {
        it('should throw error if event binding value is not a function', () => {
            const binding = { type: 'event', name: 'click', attribute: 'data-b-0' };
            expect(() => HTMLParser.validateBinding(binding, 'not a function')).toThrow(DigitalComponentError);
            expect(() => HTMLParser.validateBinding(binding, 'not a function')).toThrow(/must be a function/);
        });

        it('should throw error if property binding value is a function', () => {
            const binding = { type: 'prop', name: 'value', attribute: 'data-b-0' };
            expect(() => HTMLParser.validateBinding(binding, () => {})).toThrow(DigitalComponentError);
        });

        it('should throw error if property binding value is an HTMLResult', () => {
            const binding = { type: 'prop', name: 'value', attribute: 'data-b-0' };
            const nestedHtml = new HTMLResult([''], []);
            expect(() => HTMLParser.validateBinding(binding, nestedHtml)).toThrow(
                /cannot be a function or HTMLResult instance/
            );
        });

        it('should not throw if bindings are valid', () => {
            const eventBinding = { type: 'event', name: 'click', attribute: 'data-b-0' };
            const propBinding = { type: 'prop', name: 'value', attribute: 'data-b-0' };

            expect(() => HTMLParser.validateBinding(eventBinding, () => {})).not.toThrow();
            expect(() => HTMLParser.validateBinding(propBinding, 'valid string')).not.toThrow();
            expect(() => HTMLParser.validateBinding(propBinding, 123)).not.toThrow();
        });
    });

    describe('escapeHtmlPart()', () => {
        it('should return empty string for null or undefined', () => {
            expect(HTMLParser.escapeHtmlPart(null)).toBe('');
            expect(HTMLParser.escapeHtmlPart(undefined)).toBe('');
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
