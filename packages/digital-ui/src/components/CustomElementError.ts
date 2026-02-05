import { DigitalError } from '@digital-net-org/digital-core';

export class CustomElementError extends DigitalError {
    public constructor(message: string, caller: string) {
        super(message, caller);
    }
}
