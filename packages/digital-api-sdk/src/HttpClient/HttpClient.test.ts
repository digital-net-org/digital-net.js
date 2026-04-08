import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from './HttpClient';
import { HttpClientError } from './HttpClientError';
import { DN_API_AUTH_USER_REFRESH } from '../routes';
import { DN_STORAGE_KEY } from './constants';

const BASE_URL = 'https://api.example.test';

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function emptyResponse(status: number): Response {
    return new Response(null, { status });
}

function createLocalStorageStub(): Storage {
    const store = new Map<string, string>();
    return {
        getItem: (key: string): string | null => store.get(key) ?? null,
        setItem: (key: string, value: string): Map<string, string> => store.set(key, String(value)),
        removeItem: (key: string): boolean => store.delete(key),
        clear: (): void => store.clear(),
        key: (index: number): string | null => Array.from(store.keys())[index] ?? null,
        get length(): number {
            return store.size;
        },
    };
}

function callOf(fetchMock: ReturnType<typeof vi.fn>, index: number): { url: string; init: RequestInit } {
    const [input, init] = fetchMock.mock.calls[index] as [RequestInfo | URL, RequestInit | undefined];
    return { url: String(input), init: init ?? {} };
}

describe('HttpClient', () => {
    let client: HttpClient;
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.stubGlobal('localStorage', createLocalStorageStub());
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        client = new HttpClient({ baseUrl: BASE_URL });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    describe('request()', () => {
        it('performs a basic GET and returns data/status/ok', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1, name: 'Alice' }));
            const response = await client.request<{ id: number; name: string }>({
                path: 'user/self',
                method: 'GET',
            });

            expect(response.status).toBe(200);
            expect(response.ok).toBe(true);
            expect(response.data).toEqual({ id: 1, name: 'Alice' });

            const { url, init } = callOf(fetchMock, 0);
            expect(url).toBe(`${BASE_URL}/user/self`);
            expect(init.method).toBe('GET');
        });

        it('adds the Authorization header when a token is in localStorage', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'tok-abc');
            fetchMock.mockResolvedValueOnce(jsonResponse({}));

            await client.request({ path: 'user/self', method: 'GET' });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['Authorization']).toBe('Bearer tok-abc');
        });

        it('does not send Authorization when skipAuth is true', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'tok-abc');
            fetchMock.mockResolvedValueOnce(jsonResponse({}));

            await client.request({ path: 'authentication/user/login', method: 'POST', skipAuth: true });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['Authorization']).toBeUndefined();
        });

        it('resolves slugs in the URL', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({}));

            await client.request({
                path: 'user/:id/avatar',
                method: 'GET',
                slugs: { id: 42 },
            });

            const { url } = callOf(fetchMock, 0);
            expect(url).toBe(`${BASE_URL}/user/42/avatar`);
        });

        it('appends params as query string', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({}));

            await client.request({
                path: 'admin/user',
                method: 'GET',
                params: { isActive: true, search: 'foo bar' },
            });

            const { url } = callOf(fetchMock, 0);
            expect(url).toBe(`${BASE_URL}/admin/user?isActive=true&search=foo%20bar`);
        });

        it('JSON-stringifies an object body and sends application/json', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({}));

            await client.request<unknown, { login: string; password: string }>({
                path: 'authentication/user/login',
                method: 'POST',
                body: { login: 'alice', password: 'pwd' },
            });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['Content-Type']).toBe('application/json');
            expect(init.body).toBe('{"login":"alice","password":"pwd"}');
        });

        it('does not stringify FormData and removes Content-Type', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({}));
            const form = new FormData();
            form.append('file', new Blob(['hello']), 'hello.txt');

            await client.request({
                path: 'user/self/avatar',
                method: 'PUT',
                body: form,
            });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['Content-Type']).toBeUndefined();
            expect(init.body).toBe(form);
        });

        it('sends credentials: include by default', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({}));
            await client.request({ path: 'user/self', method: 'GET' });
            const { init } = callOf(fetchMock, 0);
            expect(init.credentials).toBe('include');
        });

        it('returns null data on 204 No Content', async () => {
            fetchMock.mockResolvedValueOnce(emptyResponse(204));

            const response = await client.request<null>({
                path: 'authentication/user/logout',
                method: 'POST',
            });

            expect(response.status).toBe(204);
            expect(response.data).toBeNull();
        });

        it('throws HttpClientError with status and data when response is not ok', async () => {
            fetchMock
                .mockResolvedValueOnce(jsonResponse({ errors: ['nope'] }, 400))
                .mockResolvedValueOnce(jsonResponse({ errors: ['nope'] }, 400));

            await expect(client.request({ path: 'admin/user', method: 'POST' })).rejects.toMatchObject({
                status: 400,
                data: { errors: ['nope'] },
            });

            await expect(client.request({ path: 'admin/user', method: 'POST' })).rejects.toBeInstanceOf(
                HttpClientError
            );
        });
    });

    describe('401 refresh flow', () => {
        it('refreshes the token and retries the original request once on 401', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'old-token');

            fetchMock
                .mockResolvedValueOnce(emptyResponse(401))
                .mockResolvedValueOnce(jsonResponse({ value: 'new-token' }))
                .mockResolvedValueOnce(jsonResponse({ id: 1 }));

            const response = await client.request<{ id: number }>({
                path: 'user/self',
                method: 'GET',
            });

            expect(response.data).toEqual({ id: 1 });
            expect(localStorage.getItem(DN_STORAGE_KEY)).toBe('new-token');
            expect(fetchMock).toHaveBeenCalledTimes(3);

            const refreshCall = callOf(fetchMock, 1);
            expect(refreshCall.url).toBe(`${BASE_URL}/${DN_API_AUTH_USER_REFRESH}`);
            expect(refreshCall.init.method).toBe('POST');

            const retryCall = callOf(fetchMock, 2);
            const retryHeaders = retryCall.init.headers as Record<string, string>;
            expect(retryHeaders['Authorization']).toBe('Bearer new-token');
        });

        it('clears the token, emits authError and throws when refresh itself fails', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'old-token');

            fetchMock.mockResolvedValueOnce(emptyResponse(401)).mockResolvedValueOnce(emptyResponse(401));

            const authErrorListener = vi.fn();
            const tokenChangeListener = vi.fn();
            client.subscribeAuthErrorEvent(authErrorListener);
            client.subscribeTokenChangeEvent(tokenChangeListener);

            await expect(client.request({ path: 'user/self', method: 'GET' })).rejects.toBeInstanceOf(HttpClientError);

            expect(localStorage.getItem(DN_STORAGE_KEY)).toBeNull();
            expect(authErrorListener).toHaveBeenCalledTimes(1);
            expect(tokenChangeListener).toHaveBeenCalledWith(undefined);
        });

        it('deduplicates concurrent refresh calls', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'old-token');

            let resolveRefresh!: (_value: Response) => void;
            const refreshPending = new Promise<Response>(resolve => {
                resolveRefresh = resolve;
            });

            fetchMock.mockImplementation(async (input: RequestInfo | URL, init: RequestInit = {}) => {
                const url = String(input);
                if (url.endsWith(DN_API_AUTH_USER_REFRESH) && init.method === 'POST') {
                    return refreshPending;
                }
                if ((init.headers as Record<string, string>)['Authorization'] === 'Bearer new-token') {
                    return jsonResponse({ ok: true });
                }
                return emptyResponse(401);
            });

            const p1 = client.request({ path: 'user/self', method: 'GET' });
            const p2 = client.request({ path: 'admin/user', method: 'GET' });

            await Promise.resolve();
            await Promise.resolve();

            resolveRefresh(jsonResponse({ value: 'new-token' }));

            await Promise.all([p1, p2]);

            const refreshCalls = fetchMock.mock.calls.filter(([input, init]) => {
                const url = String(input);
                const i = (init ?? {}) as RequestInit;
                return url.endsWith(DN_API_AUTH_USER_REFRESH) && i.method === 'POST';
            });
            expect(refreshCalls).toHaveLength(1);
        });
    });

    describe('token management', () => {
        it('setToken stores in localStorage and emits tokenChange', () => {
            const listener = vi.fn();
            const unsubscribe = client.subscribeTokenChangeEvent(listener);

            client.setToken('xyz');
            expect(localStorage.getItem(DN_STORAGE_KEY)).toBe('xyz');
            expect(listener).toHaveBeenCalledWith('xyz');

            unsubscribe();
            client.setToken('after-unsub');
            expect(listener).toHaveBeenCalledTimes(1);
        });

        it('clearToken removes the entry from localStorage and emits undefined', () => {
            localStorage.setItem(DN_STORAGE_KEY, 'xyz');
            const listener = vi.fn();
            client.subscribeTokenChangeEvent(listener);

            client.clearToken();

            expect(localStorage.getItem(DN_STORAGE_KEY)).toBeNull();
            expect(listener).toHaveBeenCalledWith(undefined);
        });

        it('getToken reads from localStorage', () => {
            expect(client.getToken()).toBeUndefined();
            localStorage.setItem(DN_STORAGE_KEY, 'abc');
            expect(client.getToken()).toBe('abc');
        });
    });

    describe('API key authentication', () => {
        const API_KEY = 'KEY-XYZ-123';

        it('sends DN-Api-Key header when constructed with apiKey', async () => {
            const apiKeyClient = new HttpClient({ baseUrl: BASE_URL, apiKey: API_KEY });
            fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

            await apiKeyClient.request({ path: 'user/self', method: 'GET' });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['DN-Api-Key']).toBe(API_KEY);
        });

        it('does not send Authorization header even when a JWT is in localStorage', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'jwt-tok');
            const apiKeyClient = new HttpClient({ baseUrl: BASE_URL, apiKey: API_KEY });
            fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

            await apiKeyClient.request({ path: 'user/self', method: 'GET' });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['Authorization']).toBeUndefined();
            expect(headers['DN-Api-Key']).toBe(API_KEY);
        });

        it('skipAuth removes both DN-Api-Key and Authorization headers', async () => {
            const apiKeyClient = new HttpClient({ baseUrl: BASE_URL, apiKey: API_KEY });
            fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

            await apiKeyClient.request({ path: 'public/health', method: 'GET', skipAuth: true });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['DN-Api-Key']).toBeUndefined();
            expect(headers['Authorization']).toBeUndefined();
        });

        it('throws HttpClientError on 401 without attempting refresh', async () => {
            const apiKeyClient = new HttpClient({ baseUrl: BASE_URL, apiKey: API_KEY });
            fetchMock.mockResolvedValueOnce(emptyResponse(401));

            await expect(apiKeyClient.request({ path: 'user/self', method: 'GET' })).rejects.toBeInstanceOf(
                HttpClientError
            );

            expect(fetchMock).toHaveBeenCalledTimes(1);
            const refreshCalls = fetchMock.mock.calls.filter(([input]) =>
                String(input).endsWith(DN_API_AUTH_USER_REFRESH)
            );
            expect(refreshCalls).toHaveLength(0);
        });

        it('does not clear token nor emit authError on 401 in API key mode', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'jwt-tok');
            const apiKeyClient = new HttpClient({ baseUrl: BASE_URL, apiKey: API_KEY });
            fetchMock.mockResolvedValueOnce(emptyResponse(401));

            const authErrorListener = vi.fn();
            const tokenChangeListener = vi.fn();
            apiKeyClient.subscribeAuthErrorEvent(authErrorListener);
            apiKeyClient.subscribeTokenChangeEvent(tokenChangeListener);

            await expect(apiKeyClient.request({ path: 'user/self', method: 'GET' })).rejects.toBeInstanceOf(
                HttpClientError
            );

            expect(localStorage.getItem(DN_STORAGE_KEY)).toBe('jwt-tok');
            expect(authErrorListener).not.toHaveBeenCalled();
            expect(tokenChangeListener).not.toHaveBeenCalled();
        });
    });

    describe('keyPrefix', () => {
        const PREFIX = 'tenant_a_';
        const PREFIXED_STORAGE_KEY = `${PREFIX}${DN_STORAGE_KEY}`;
        const PREFIXED_API_KEY_HEADER = `${PREFIX}DN-Api-Key`;

        it('writes the access token under the prefixed localStorage key', () => {
            const prefixed = new HttpClient({ baseUrl: BASE_URL, keyPrefix: PREFIX });

            prefixed.setToken('tok-xyz');

            expect(localStorage.getItem(PREFIXED_STORAGE_KEY)).toBe('tok-xyz');
            expect(localStorage.getItem(DN_STORAGE_KEY)).toBeNull();
        });

        it('reads the access token from the prefixed localStorage key', () => {
            localStorage.setItem(PREFIXED_STORAGE_KEY, 'pre-seeded');
            const prefixed = new HttpClient({ baseUrl: BASE_URL, keyPrefix: PREFIX });

            expect(prefixed.getToken()).toBe('pre-seeded');
        });

        it('sends the API key under the prefixed header name', async () => {
            const prefixed = new HttpClient({ baseUrl: BASE_URL, apiKey: 'KEY-1', keyPrefix: PREFIX });
            fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

            await prefixed.request({ path: 'user/self', method: 'GET' });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers[PREFIXED_API_KEY_HEADER]).toBe('KEY-1');
            expect(headers['DN-Api-Key']).toBeUndefined();
        });

        it('two clients with different prefixes do not collide on localStorage', () => {
            const clientA = new HttpClient({ baseUrl: BASE_URL, keyPrefix: 'tenant_a_' });
            const clientB = new HttpClient({ baseUrl: BASE_URL, keyPrefix: 'tenant_b_' });

            clientA.setToken('token-A');

            expect(clientA.getToken()).toBe('token-A');
            expect(clientB.getToken()).toBeUndefined();
        });
    });

    describe('in-memory token fallback (Node)', () => {
        let nodeClient: HttpClient;

        beforeEach(() => {
            // Force `typeof localStorage === 'undefined'` to simulate a Node-only runtime.
            vi.stubGlobal('localStorage', undefined);
            fetchMock = vi.fn();
            vi.stubGlobal('fetch', fetchMock);
            nodeClient = new HttpClient({ baseUrl: BASE_URL });
        });

        it('stores the token in memory when localStorage is not defined', () => {
            const listener = vi.fn();
            nodeClient.subscribeTokenChangeEvent(listener);

            nodeClient.setToken('node-tok');

            expect(nodeClient.getToken()).toBe('node-tok');
            expect(listener).toHaveBeenCalledWith('node-tok');
        });

        it('clearToken wipes the in-memory token and emits undefined', () => {
            nodeClient.setToken('node-tok');
            const listener = vi.fn();
            nodeClient.subscribeTokenChangeEvent(listener);

            nodeClient.clearToken();

            expect(nodeClient.getToken()).toBeUndefined();
            expect(listener).toHaveBeenCalledWith(undefined);
        });

        it('uses the in-memory token in the Authorization header on requests', async () => {
            nodeClient.setToken('node-tok');
            fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

            await nodeClient.request({ path: 'user/self', method: 'GET' });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['Authorization']).toBe('Bearer node-tok');
        });

        it('refreshes and persists the new token in memory on 401', async () => {
            nodeClient.setToken('old-node-tok');

            fetchMock
                .mockResolvedValueOnce(emptyResponse(401))
                .mockResolvedValueOnce(jsonResponse({ value: 'new-node-tok' }))
                .mockResolvedValueOnce(jsonResponse({ id: 1 }));

            const response = await nodeClient.request<{ id: number }>({
                path: 'user/self',
                method: 'GET',
            });

            expect(response.data).toEqual({ id: 1 });
            expect(nodeClient.getToken()).toBe('new-node-tok');
        });
    });

    describe('refreshToken() (public)', () => {
        it('exposes refreshToken as a public method that returns the new token', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({ value: 'fresh-tok' }));

            const newToken = await client.refreshToken();

            expect(newToken).toBe('fresh-tok');
            expect(localStorage.getItem(DN_STORAGE_KEY)).toBe('fresh-tok');

            const { url, init } = callOf(fetchMock, 0);
            expect(url).toBe(`${BASE_URL}/${DN_API_AUTH_USER_REFRESH}`);
            expect(init.method).toBe('POST');
            expect(init.credentials).toBe('include');
        });

        it('returns undefined and clears state when the refresh endpoint fails', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'old-tok');
            fetchMock.mockResolvedValueOnce(emptyResponse(401));

            const newToken = await client.refreshToken();

            expect(newToken).toBeUndefined();
            expect(localStorage.getItem(DN_STORAGE_KEY)).toBeNull();
        });

        it('treats a 200 refresh response with hasError=true as a failure', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'old-tok');
            fetchMock.mockResolvedValueOnce(
                jsonResponse({ value: 'should-be-ignored', hasError: true, errors: [{ message: 'nope' }], infos: [] })
            );

            const authErrorListener = vi.fn();
            client.subscribeAuthErrorEvent(authErrorListener);

            const newToken = await client.refreshToken();

            expect(newToken).toBeUndefined();
            expect(localStorage.getItem(DN_STORAGE_KEY)).toBeNull();
            expect(authErrorListener).toHaveBeenCalledTimes(1);
        });

        it('treats a 200 refresh response missing value as a failure', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'old-tok');
            fetchMock.mockResolvedValueOnce(jsonResponse({ hasError: false, errors: [], infos: [] }));

            const authErrorListener = vi.fn();
            client.subscribeAuthErrorEvent(authErrorListener);

            const newToken = await client.refreshToken();

            expect(newToken).toBeUndefined();
            expect(localStorage.getItem(DN_STORAGE_KEY)).toBeNull();
            expect(authErrorListener).toHaveBeenCalledTimes(1);
        });
    });

    describe('onRequest / onResponse hooks', () => {
        it('calls onRequest before fetch and uses the returned config', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
            const onRequest = vi.fn(cfg => ({
                ...cfg,
                headers: { ...cfg.headers, 'X-Trace': 'abc' },
            }));

            await client.request({ path: 'user/self', method: 'GET', onRequest });

            expect(onRequest).toHaveBeenCalledTimes(1);
            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['X-Trace']).toBe('abc');
        });

        it('onRequest hook can mutate path, slugs and params', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
            const onRequest = vi.fn(cfg => ({
                ...cfg,
                path: 'user/:id',
                slugs: { id: 99 },
                params: { q: 'abc' },
            }));

            await client.request({ path: 'placeholder', method: 'GET', onRequest });

            const { url } = callOf(fetchMock, 0);
            expect(url).toBe(`${BASE_URL}/user/99?q=abc`);
        });

        it('onRequest hook returning a Promise is awaited', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
            const onRequest = vi.fn(async cfg => {
                await new Promise<void>(r => setTimeout(r, 5));
                return { ...cfg, headers: { ...cfg.headers, 'X-Async': '1' } };
            });

            await client.request({ path: 'user/self', method: 'GET', onRequest });

            const { init } = callOf(fetchMock, 0);
            const headers = init.headers as Record<string, string>;
            expect(headers['X-Async']).toBe('1');
        });

        it('calls onResponse with the deserialized response on success', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }));
            const onResponse = vi.fn();

            await client.request({ path: 'user/self', method: 'GET', onResponse });

            expect(onResponse).toHaveBeenCalledTimes(1);
            const response = onResponse.mock.calls[0][0];
            expect(response).toMatchObject({ status: 200, ok: true, data: { id: 1 } });
        });

        it('calls onResponse on 4xx before throwing', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 400));
            const onResponse = vi.fn();

            await expect(
                client.request({ path: 'admin/user', method: 'POST', onResponse })
            ).rejects.toBeInstanceOf(HttpClientError);

            expect(onResponse).toHaveBeenCalledTimes(1);
            const response = onResponse.mock.calls[0][0];
            expect(response).toMatchObject({ status: 400, ok: false });
            expect(response.data).toEqual({ error: 'nope' });
        });

        it('hooks run on both the initial call and the retry after a 401 refresh', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'old-token');
            fetchMock
                .mockResolvedValueOnce(emptyResponse(401))
                .mockResolvedValueOnce(jsonResponse({ value: 'new-token', hasError: false, errors: [], infos: [] }))
                .mockResolvedValueOnce(jsonResponse({ id: 1 }));

            const onRequest = vi.fn(cfg => cfg);
            const onResponse = vi.fn();

            await client.request({ path: 'user/self', method: 'GET', onRequest, onResponse });

            expect(onRequest).toHaveBeenCalledTimes(2);
            expect(onResponse).toHaveBeenCalledTimes(2);
        });

        it('hooks do NOT run on the internal refresh-token request', async () => {
            localStorage.setItem(DN_STORAGE_KEY, 'old-token');
            fetchMock
                .mockResolvedValueOnce(emptyResponse(401))
                .mockResolvedValueOnce(jsonResponse({ value: 'new-token', hasError: false, errors: [], infos: [] }))
                .mockResolvedValueOnce(jsonResponse({ id: 1 }));

            const onRequest = vi.fn(cfg => cfg);
            const onResponse = vi.fn();

            await client.request({ path: 'user/self', method: 'GET', onRequest, onResponse });

            // Si les hooks voyaient le refresh, on aurait 3 appels (initial + refresh + retry).
            expect(onRequest).toHaveBeenCalledTimes(2);
            expect(onResponse).toHaveBeenCalledTimes(2);
            // Aucune des invocations ne doit être sur le path de refresh
            for (const call of onResponse.mock.calls) {
                const response = call[0] as { data: unknown };
                expect(response.data).not.toMatchObject({ value: 'new-token' });
            }
        });

        it('propagates exceptions thrown by onResponse', async () => {
            fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
            const onResponse = vi.fn(() => {
                throw new Error('instrumentation broke');
            });

            await expect(
                client.request({ path: 'user/self', method: 'GET', onResponse })
            ).rejects.toThrow('instrumentation broke');
        });

        it('propagates exceptions thrown by onRequest', async () => {
            const onRequest = vi.fn(() => {
                throw new Error('config broke');
            });

            await expect(
                client.request({ path: 'user/self', method: 'GET', onRequest })
            ).rejects.toThrow('config broke');

            expect(fetchMock).not.toHaveBeenCalled();
        });
    });
});
