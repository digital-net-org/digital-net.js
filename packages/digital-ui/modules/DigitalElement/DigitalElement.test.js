import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DigitalElement } from './DigitalElement.js';

describe('DigitalElement', () => {
    describe('DigitalElement abstract class implementation', () => {
        it('Should throw an error if the class is instantiated', () => {
            expect(() => new DigitalElement()).toThrow();
        });
    });

    describe('DigitalElement Integration', () => {
        class TestElement extends DigitalElement {
            render() {
                return '<div id="test-content">Hello World</div>';
            }
            renderStyle() {
                return 'div { color: red; }';
            }
        }

        beforeEach(() => (document.body.innerHTML = ''));

        it('should properly instantiate and attach to the DOM', () => {
            TestElement.define('test-element');

            const el = document.createElement('test-element');
            document.body.appendChild(el);

            expect(document.querySelector('test-element')).not.toBeNull();
            expect(el.shadowRoot).not.toBeNull();

            const styleTag = el.shadowRoot.querySelector('style');
            const content = el.shadowRoot.querySelector('#test-content');

            expect(styleTag.textContent).toContain('color: red;');
            expect(content.textContent).toBe('Hello World');
        });

        it('should reuse the cached template on second instantiation', () => {
            const el1 = document.createElement('test-element');
            const el2 = document.createElement('test-element');

            document.body.appendChild(el1);
            document.body.appendChild(el2);

            // Expected to have identical shadow DOM content...
            expect(el1.shadowRoot.innerHTML).toBe(el2.shadowRoot.innerHTML);
            // ...but they should be different instances
            expect(el1).not.toBe(el2);
        });
    });

    describe('define()', () => {
        class DigitalElExtension extends DigitalElement {}
        it('Should throw an error if window.customElements.define() is undefined', () => {
            vi.stubGlobal('window', undefined);
            expect(() => DigitalElExtension.define()).toThrow();
            vi.unstubAllGlobals();
        });

        it('Should define the custom Element implementation', () => {
            DigitalElExtension.define();
            const definition = customElements.get('digital-el-extension');
            expect(definition).toBe(DigitalElExtension);
        });
    });
});
