export class DigitalComponentError extends Error {
    /**
     * @param {string} message The error message.
     * @param {string} [caller] The caller function or class name.
     */
    constructor(message, caller) {
        super();
        this.name = 'DigitalComponentError';
        this.message = `[DigitalComponentError${caller ? ' ' + caller : ''}]: ${message}`;
    }
}
