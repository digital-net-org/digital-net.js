export class DigitalUiError extends Error {
    /**
     * @param {string} message The error message.
     * @param {string} [caller] The caller function or class name.
     */
    constructor(message, caller) {
        super();
        this.name = 'DigitalUiError';
        this.message = `[DigitalUiError${caller ? ' ' + caller : ''}]: ${message}`;
    }
}
