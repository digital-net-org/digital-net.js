import { DigitalError } from '../../core';

export class DigitalComponentError extends DigitalError {
    constructor(message, caller) {
        super(message, caller);
    }
}
