import { DigitalUiError } from '../../Error';
import { CSSResult } from './CSSResult.js';

/**
 * Tagged template function for CSS.
 * Only allows interpolation of numbers or other CSSResult instances.
 * @param {TemplateStringsArray} strings
 * @param {...(CSSResult|number)} values
 * @example css` button { color: red; } `
 * @returns {CSSResult}
 */
export const css = (strings, ...values) => {
    const cssString = strings.reduce((acc, str, i) => {
        const value = values[i];
        if (value === undefined) {
            return acc + str;
        }
        if (value instanceof CSSResult) {
            return acc + str + value.toString();
        }
        if (typeof value === 'number') {
            return acc + str + String(value);
        }
        throw new DigitalUiError(
            `Interpolation of ${typeof value} is forbidden. Use CSS variables for dynamic values or wrap CSS fragments in css.`,
            'Tagged template css'
        );
    }, '');

    return new CSSResult(cssString);
};
