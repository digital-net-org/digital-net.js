import { DigitalError } from '@digital-net/core';

export class DigitalComponentError extends DigitalError {
    constructor(message, caller) {
        super(message, caller);
    }
}
