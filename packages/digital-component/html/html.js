import { HTMLResult } from './HTMLResult.js';

/**
 * Tagged template function for HTML.
 */
export const html = (strings, ...values) => {
    return new HTMLResult(strings, values);
};
