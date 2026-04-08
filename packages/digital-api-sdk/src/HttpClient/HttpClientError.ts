import { DigitalError } from '@digital-net-org/digital-core';

export class HttpClientError<T = unknown> extends DigitalError {
    public readonly status: number;
    public readonly data: T;

    public constructor(status: number, data: T, message?: string) {
        super(message ?? `HTTP ${status}`, 'HttpClient');
        this.status = status;
        this.data = data;
    }
}
