import { describe, it, expect } from 'vitest';
import { DigitalComponentError } from '../Error';
import { HTMLBindingValue } from './HTMLBindingValue.js';
import { HTMLResult } from './HTMLResult.js';

describe('HTMLBindingValue', () => {
    const prefix = HTMLBindingValue.bindingPlaceholderPrefix;

    describe('Constructor & Properties', () => {
        it('should generate the correct id', () => {
            const binding = new HTMLBindingValue({ type: 'prop', name: 'class', value: 'foo', index: 42 });
            expect(binding.id).toBe(`${prefix}42`);
        });

        it('should return a comment placeholder for node type', () => {
            const binding = new HTMLBindingValue({ type: 'node', name: null, value: 'text', index: 1 });
            expect(binding.placeholder).toBe(`<!--${prefix}1-->`);
        });

        it('should return a comment placeholder for html type', () => {
            const binding = new HTMLBindingValue({ type: 'html', name: null, value: new HTMLResult(), index: 2 });
            expect(binding.placeholder).toBe(`<!--${prefix}2-->`);
        });

        it('should return a raw id for event and prop types', () => {
            const propBinding = new HTMLBindingValue({ type: 'prop', name: 'value', value: 'hi', index: 3 });
            const eventBinding = new HTMLBindingValue({ type: 'event', name: 'click', value: () => void 0, index: 4 });

            expect(propBinding.placeholder).toBe(`${prefix}3`);
            expect(eventBinding.placeholder).toBe(`${prefix}4`);
        });
    });

    describe('Validation Logic', () => {
        it('should throw if event value is not a function', () => {
            expect(() => {
                new HTMLBindingValue({ type: 'event', name: 'click', value: 'not-a-func', index: 0 });
            }).toThrow(DigitalComponentError);
        });

        it('should throw if prop value is a function', () => {
            expect(() => {
                new HTMLBindingValue({ type: 'prop', name: 'title', value: () => void 0, index: 0 });
            }).toThrow(DigitalComponentError);
        });

        it('should throw if prop value is an HTMLResult', () => {
            expect(() => {
                new HTMLBindingValue({ type: 'prop', name: 'title', value: new HTMLResult(), index: 0 });
            }).toThrow(DigitalComponentError);
        });

        it('should throw if html type value is not an HTMLResult', () => {
            expect(() => {
                new HTMLBindingValue({ type: 'html', name: null, value: '<div></div>', index: 0 });
            }).toThrow(DigitalComponentError);
        });

        it('should pass validation for valid configurations', () => {
            expect(
                () => new HTMLBindingValue({ type: 'event', name: 'input', value: () => void 0, index: 0 })
            ).not.toThrow();
            expect(() => new HTMLBindingValue({ type: 'prop', name: 'disabled', value: true, index: 1 })).not.toThrow();
            expect(
                () => new HTMLBindingValue({ type: 'html', name: null, value: new HTMLResult(), index: 2 })
            ).not.toThrow();
            expect(
                () => new HTMLBindingValue({ type: 'node', name: null, value: 'some text', index: 3 })
            ).not.toThrow();
        });
    });
});
