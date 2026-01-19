import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DigitalElement } from './DigitalElement.js';
import { css } from '../styles/css';

describe('DigitalElement', () => {
    describe('Component abstract class implementation', () => {
        it('Should throw an error if the class is instantiated', () => {
            expect(() => new DigitalElement()).toThrow();
        });
    });

    describe('Component Integration', () => {
        class TestElement extends DigitalElement {
            render() {
                return '<div id="test-content">Hello World</div>';
            }
            renderStyle() {
                return css`
                    div {
                        color: red;
                    }
                `;
            }
        }

        beforeEach(() => (document.body.innerHTML = ''));

        it('should throw an error if renderStyle does not return CSSResult', () => {
            class TestElementCssError extends TestElement {
                renderStyle() {
                    return 'div { color: blue; }';
                }
            }

            TestElementCssError.define();
            expect(() => document.createElement('test-element-css-error')).toThrow();
        });

        it('should properly instantiate and attach to the DOM', () => {
            class TestElementInstantiateSuccess extends TestElement {}
            TestElementInstantiateSuccess.define();

            const el = document.createElement('test-element-instantiate-success');
            document.body.appendChild(el);

            expect(document.querySelector('test-element-instantiate-success')).not.toBeNull();
            expect(el.shadowRoot).not.toBeNull();

            expect(el.shadowRoot.querySelector('#test-content').textContent).toBe('Hello World');

            // This is supported by happy-dom
            expect(
                Array.from(el.shadowRoot.adoptedStyleSheets[0].cssRules)
                    .map(rule => rule.cssText)
                    .join('')
            ).toContain('color: red');
        });

        it('should fallback to a style tag when adoptedStyleSheets is not supported', () => {
            const originalAdoptedStyleSheets = Document.prototype.adoptedStyleSheets;

            try {
                class TestElementNoAdoptedStyles extends TestElement {}
                TestElementNoAdoptedStyles.define();
                delete Document.prototype.adoptedStyleSheets;
                delete ShadowRoot.prototype.adoptedStyleSheets;

                const el = document.createElement('test-element-no-adopted-styles');
                document.body.appendChild(el);

                const styleTag = el.shadowRoot.querySelector('style');
                expect(styleTag.id).toContain('test-element-no-adopted-styles-style');
                expect(styleTag).not.toBeNull();
                expect(styleTag.textContent).toContain('color: red');
                expect(el.shadowRoot.adoptedStyleSheets).toBeUndefined();
            } finally {
                // Restore original property for other tests
                Document.prototype.adoptedStyleSheets = originalAdoptedStyleSheets;
                ShadowRoot.prototype.adoptedStyleSheets = originalAdoptedStyleSheets;
            }
        });

        it('should reuse the cached template on second instantiation', () => {
            class TestElementMultipleInstances extends TestElement {}
            TestElementMultipleInstances.define();
            const el1 = document.createElement('test-element-multiple-instances');
            const el2 = document.createElement('test-element-multiple-instances');

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
