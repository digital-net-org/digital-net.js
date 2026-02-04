import { DigitalError } from '@digital-net/core';

export class CustomElementError extends DigitalError {
    constructor(message: string, caller: string) {
        super(message, caller);
    }
}
