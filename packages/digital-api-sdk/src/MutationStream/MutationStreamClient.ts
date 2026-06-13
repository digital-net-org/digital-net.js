import { URLResolver } from '@digital-net-org/digital-core';
import { DN_APPLICATION_KEY_HEADER, type HttpClient } from '../HttpClient';
import type { MutationSignal, MutationStreamConnectOptions, MutationStreamState } from './types';
import { SseParser } from './SseParser';
import { StreamRequestError } from './StreamRequestError';
import { computeBackoffDelay, isConnectionStable } from './backoff';

const DN_API_EVENTS_MUTATION_STREAM = 'events/mutation/stream' as const;
const MUTATION_EVENT_TYPE = 'mutation';

/**
 * Consumes the API mutation stream `ReadableStream`, `EventSource` cannot send auth headers. Authenticates with the
 * shared application key (mandatory: throws without one). Reconnects automatically with exponential
 * backoff and resumes from the last received cursor (`?lastEventId=`): missed signals are replayed
 * by the server catch-up, so no invalidation is ever lost.
 */
export class MutationStreamClient {
    private readonly http: HttpClient;
    private readonly applicationKey: string;

    private abortController: AbortController | null = null;
    private lastEventId: string | undefined;
    private state: MutationStreamState = 'closed';

    public constructor(http: HttpClient) {
        const applicationKey = http.getApplicationKey();
        if (!applicationKey) {
            throw new Error('MutationStreamClient requires an application key (set HttpClient `applicationKey`).');
        }
        this.http = http;
        this.applicationKey = applicationKey;
    }

    public getState(): MutationStreamState {
        return this.state;
    }

    /** Opens the stream (closing any previous connection) and returns a disconnect function. */
    public connect(options: MutationStreamConnectOptions): () => void {
        this.disconnect();
        const abortController = new AbortController();
        this.abortController = abortController;
        void this.runLoop(options, abortController);
        return () => {
            if (this.abortController === abortController) {
                this.disconnect();
            }
        };
    }

    public disconnect(): void {
        this.abortController?.abort();
        this.abortController = null;
    }

    private async runLoop(options: MutationStreamConnectOptions, abortController: AbortController): Promise<void> {
        const { signal } = abortController;
        let attempt = 0;

        while (!signal.aborted) {
            this.setState('connecting', options);
            let openedAt: number | null = null;
            try {
                await this.streamOnce(options, signal, () => {
                    openedAt = Date.now();
                    this.setState('open', options);
                });
            } catch {
                if (signal.aborted) {
                    break;
                }
                // Including 401s (invalid/rotated key): keep retrying with backoff.
            }
            if (signal.aborted) {
                break;
            }
            // Reset the backoff only after a stable connection. Otherwise an accept-then-close server would
            // reconnect in a ~1s tight loop forever instead of backing off.
            attempt = isConnectionStable(openedAt, Date.now()) ? 0 : attempt + 1;
            await this.delay(computeBackoffDelay(attempt), signal);
        }

        const isCurrent = this.abortController === abortController;
        if (isCurrent) {
            this.abortController = null;
        }
        if (isCurrent || this.abortController === null) {
            this.setState('closed', options);
        }
    }

    private async streamOnce(
        options: MutationStreamConnectOptions,
        signal: AbortSignal,
        onOpen: () => void
    ): Promise<void> {
        const response = await fetch(this.resolveUrl(), {
            headers: this.resolveHeaders(),
            credentials: 'include',
            signal,
        });
        if (!response.ok || !response.body) {
            throw new StreamRequestError(response.status);
        }
        onOpen();

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const parser = new SseParser();

        for (;;) {
            const { done, value } = await reader.read();
            if (done) {
                return; // Server closed the stream: the run loop reconnects from the last cursor.
            }
            for (const event of parser.push(decoder.decode(value, { stream: true }))) {
                if (event.id) {
                    this.lastEventId = event.id;
                }
                if (event.event === MUTATION_EVENT_TYPE && event.data) {
                    this.emitSignal(event.data, options);
                }
            }
        }
    }

    private emitSignal(data: string, options: MutationStreamConnectOptions): void {
        try {
            options.onSignal(JSON.parse(data) as MutationSignal);
        } catch {
            // Malformed frame: skip it — the next signal (or a refetch) restores consistency.
        }
    }

    private resolveUrl(): string {
        const url = URLResolver.resolve(this.http.getBaseUrl(), DN_API_EVENTS_MUTATION_STREAM);
        const params: Record<string, string> = {};
        if (this.lastEventId) {
            params['lastEventId'] = this.lastEventId;
        }
        return Object.keys(params).length > 0 ? URLResolver.buildQuery(url, params) : url;
    }

    private resolveHeaders(): Record<string, string> {
        return {
            Accept: 'text/event-stream',
            // Always the raw backend header: the HttpClient keyPrefix must not leak into it.
            [DN_APPLICATION_KEY_HEADER]: this.applicationKey,
        };
    }

    private setState(state: MutationStreamState, options: MutationStreamConnectOptions): void {
        if (this.state === state) {
            return;
        }
        this.state = state;
        options.onStateChange?.(state);
    }

    private delay(ms: number, signal: AbortSignal): Promise<void> {
        return new Promise(resolve => {
            const done = (): void => {
                clearTimeout(timeout);
                signal.removeEventListener('abort', done);
                resolve();
            };
            const timeout = setTimeout(done, ms);
            signal.addEventListener('abort', done, { once: true });
        });
    }
}
