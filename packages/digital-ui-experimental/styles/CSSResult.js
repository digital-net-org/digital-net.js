import { DigitalComponentError } from '../Error';

/**
 * Wraps a CSS string and provides optimized delivery for Client and Server.
 */
export class CSSResult {
    /** @type {string} */
    #cssString;
    /** @type {CSSStyleSheet | null} */
    #styleSheet = null;

    constructor(cssString) {
        this.#cssString = cssString;
    }

    /**
     * @returns {string} The raw CSS string. This is the method to use in SSR.
     */
    toString() {
        return this.#cssString;
    }

    /**
     * @throws {Error} Throws if the environment does not support CSSStyleSheet.
     * @returns {CSSStyleSheet} A cached, constructable stylesheet for the client.
     */
    get styleSheet() {
        if (typeof window === 'undefined' || !window.CSSStyleSheet) {
            throw new DigitalComponentError(
                'Cannot create a CSSStyleSheet in the current environment.',
                'get CSSResult.styleSheet'
            );
        }
        if (!this.#styleSheet) {
            this.#styleSheet = new CSSStyleSheet();
            this.#styleSheet.replaceSync(this.#cssString);
        }
        return this.#styleSheet;
    }
}
