import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient, DN_APPLICATION_KEY_HEADER } from '../HttpClient';
import { MutationStreamClient } from './MutationStreamClient';
import type { MutationSignal } from './types';

const BASE_URL = 'http://api.test';
const APP_KEY = 'app-key';

interface ControlledStream {
    response: Response;
    respond: (_init?: RequestInit) => Promise<Response>;
    push: (_text: string) => void;
    close: () => void;
}

function sseStream(status = 200): ControlledStream {
    let controller!: ReadableStreamDefaultController<Uint8Array>;
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
        start(c) {
            controller = c;
        },
    });
    const response = new Response(stream, { status, headers: { 'Content-Type': 'text/event-stream' } });
    return {
        response,
        respond: init => {
            init?.signal?.addEventListener('abort', () => {
                try {
                    controller.error(new DOMException('The operation was aborted.', 'AbortError'));
                } catch {
                    // Stream already closed.
                }
            });
            return Promise.resolve(response);
        },
        push: text => controller.enqueue(encoder.encode(text)),
        close: () => controller.close(),
    };
}

function headersOf(fetchMock: ReturnType<typeof vi.fn>, callIndex: number): Record<string, string> {
    const init = fetchMock.mock.calls[callIndex][1] as RequestInit;
    return init.headers as Record<string, string>;
}

describe('MutationStreamClient', () => {
    let http: HttpClient;
    let fetchMock: ReturnType<typeof vi.fn>;
    let disconnect: (() => void) | undefined;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        http = new HttpClient({ baseUrl: BASE_URL, applicationKey: APP_KEY });
        disconnect = undefined;
    });

    afterEach(() => {
        disconnect?.();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('throws without an application key on the HttpClient', () => {
        expect(() => new MutationStreamClient(new HttpClient({ baseUrl: BASE_URL }))).toThrow();
    });

    it('sends the raw application key header, never the bearer', async () => {
        const stream = sseStream();
        fetchMock.mockResolvedValueOnce(stream.response);
        const client = new MutationStreamClient(http);

        disconnect = client.connect({ onSignal: () => undefined });
        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

        const headers = headersOf(fetchMock, 0);
        expect(headers[DN_APPLICATION_KEY_HEADER]).toBe(APP_KEY);
        expect(headers['Authorization']).toBeUndefined();
    });

    it('emits parsed mutation signals', async () => {
        const stream = sseStream();
        fetchMock.mockResolvedValueOnce(stream.response);
        const client = new MutationStreamClient(http);
        const signals: MutationSignal[] = [];

        disconnect = client.connect({ onSignal: signal => signals.push(signal) });
        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        stream.push(': connected\n\n');
        stream.push('id: 1:a\nevent: mutation\ndata: {"type":"Updated","entity":"Page","entityId":"x"}\n\n');

        await vi.waitFor(() => expect(signals).toHaveLength(1));
        expect(signals[0]).toEqual({ type: 'Updated', entity: 'Page', entityId: 'x' });
    });

    it('parses the server-computed isSelf flag', async () => {
        const stream = sseStream();
        fetchMock.mockResolvedValueOnce(stream.response);
        const client = new MutationStreamClient(http);
        const signals: MutationSignal[] = [];

        disconnect = client.connect({ onSignal: signal => signals.push(signal) });
        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        stream.push(
            'id: 2:a\nevent: mutation\ndata: {"type":"Updated","entity":"Page","entityId":"x","isSelf":true}\n\n'
        );

        await vi.waitFor(() => expect(signals).toHaveLength(1));
        expect(signals[0]).toEqual({ type: 'Updated', entity: 'Page', entityId: 'x', isSelf: true });
    });

    it('reconnects with the last received event id', async () => {
        const first = sseStream();
        const second = sseStream();
        fetchMock.mockResolvedValueOnce(first.response).mockResolvedValueOnce(second.response);
        const client = new MutationStreamClient(http);

        disconnect = client.connect({ onSignal: () => undefined });
        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        first.push('id: 7:cursor\nevent: mutation\ndata: {"type":"Created","entity":"Tag","entityId":"t"}\n\n');
        first.close();

        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2), { timeout: 3000 });
        const url = fetchMock.mock.calls[1][0] as string;
        expect(url).toContain('lastEventId=');
        expect(decodeURIComponent(url)).toContain('7:cursor');
    });

    it('does not reconnect after disconnect', async () => {
        const stream = sseStream();
        fetchMock.mockImplementationOnce((_url: string, init?: RequestInit) => stream.respond(init));
        const client = new MutationStreamClient(http);
        const states: string[] = [];

        const stop = client.connect({ onSignal: () => undefined, onStateChange: state => states.push(state) });
        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        stop();

        await vi.waitFor(() => expect(client.getState()).toBe('closed'));
        await new Promise(resolve => setTimeout(resolve, 150));
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(states.at(-1)).toBe('closed');
    });

    it('keeps retrying with backoff after a 401', async () => {
        const stream = sseStream();
        fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 })).mockResolvedValueOnce(stream.response);
        const client = new MutationStreamClient(http);

        disconnect = client.connect({ onSignal: () => undefined });

        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2), { timeout: 3000 });
        expect(headersOf(fetchMock, 1)[DN_APPLICATION_KEY_HEADER]).toBe(APP_KEY);
    });
});
