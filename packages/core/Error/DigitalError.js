/**
 * Custom error class for digital-related errors.
 */
export class DigitalError extends Error {
    static defaultMessage = 'An error occurred.';

    /**
     * @param {string} message The error message.
     * @param {string} [caller] The caller function or class name.
     */
    constructor(message, caller) {
        super();
        this.name = this.constructor.name;
        this.message = `[${this.name}${caller ? ' ' + caller : ''}]: ${message ?? DigitalError.defaultMessage}`;
    }
}
