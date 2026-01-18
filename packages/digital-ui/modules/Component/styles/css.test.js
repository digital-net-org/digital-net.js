import { describe, it, expect } from 'vitest';
import { css } from './css.js';
import { CSSResult } from './CSSResult.js';
import { DigitalUiError } from '../../Error';

describe('css tagged template', () => {
    /**
     * @param {CSSResult} result
     * @param {string} expected
     */
    const testNormalizedResult = (result, expected) =>
        expect(result.toString().replace(/\s+/g, ' ').trim()).toBe(expected);

    it('should create a CSSResult from a simple string', () => {
        const result = css`
            button {
                color: red;
            }
        `;
        expect(result).toBeInstanceOf(CSSResult);
        testNormalizedResult(result, 'button { color: red; }');
    });

    it('should interpolate numbers correctly', () => {
        const zIndex = 10;
        const result = css`
            div {
                z-index: ${zIndex};
            }
        `;
        testNormalizedResult(result, 'div { z-index: 10; }');
    });

    it('should compose multiple CSSResult instances', () => {
        const base = css`
            div {
                color: blue;
            }
        `;
        const result = css`
            ${base}
            button {
                padding: 5px;
            }
        `;
        testNormalizedResult(result, 'div { color: blue; } button { padding: 5px; }');
    });

    it('should handle undefined values by ignoring them', () => {
        const result = css`
            p {
                margin: ${undefined};
            }
        `;
        testNormalizedResult(result, 'p { margin: ; }');
    });

    it('should throw when interpolating strings', () => {
        expect(() => {
            css`
                button {
                    color: ${'red; background: black;'};
                }
            `;
        }).toThrow();
    });

    it('should throw DigitalUiError when interpolating objects', () => {
        expect(() => {
            css`
                div {
                    ${{ some: 'style' }}
                }
            `;
        }).toThrow();
    });
});
