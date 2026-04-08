import { DigitalEvent, Env, URLResolver } from '@digital-net-org/digital-core';
import { DN_API_KEY_HEADER, DN_DEFAULT_HEADERS, DN_STORAGE_KEY } from './constants';
import { DN_API_AUTH_USER_REFRESH } from '../routes';
import { HttpClientError } from './HttpClientError';
import { HttpSerializer } from './HttpSerializer';
import type { HttpClientConfig, HttpRequestConfig, HttpResponse } from './types';

export class HttpClient {
    private readonly baseUrl: string;
    private readonly apiKey?: string;

    private readonly tokenChangeEvent: DigitalEvent<string | undefined> = new DigitalEvent();
    private readonly authErrorEvent: DigitalEvent<void> = new DigitalEvent();

    private refreshPromise: Promise<string | undefined> | null = null;
    private inMemoryToken: string | undefined;

    public constructor(config: HttpClientConfig) {
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
    }

    public async request<T = any, B = any>(config: HttpRequestConfig<B>): Promise<HttpResponse<T>> {
        return this.handleRequest<T, B>(config, false);
    }

    public getToken(): string | undefined {
        return Env.hasUsableLocalStorage() ? (localStorage.getItem(DN_STORAGE_KEY) ?? undefined) : this.inMemoryToken;
    }

    public setToken(token: string | undefined): void {
        if (!Env.hasUsableLocalStorage()) {
            this.inMemoryToken = token;
        } else if (token) {
            localStorage.setItem(DN_STORAGE_KEY, token);
        } else {
            localStorage.removeItem(DN_STORAGE_KEY);
        }
        this.tokenChangeEvent.emit(token);
    }

    public clearToken(): void {
        this.setToken(undefined);
    }

    public setTokenChangeEvent(listener: (_token: string | undefined) => void): () => void {
        return this.tokenChangeEvent.subscribe(listener);
    }

    public setAuthErrorEvent(listener: () => void): () => void {
        return this.authErrorEvent.subscribe(listener);
    }

    public async refreshToken(): Promise<string | undefined> {
        this.refreshPromise ??= this.handleRefreshToken();
        return this.refreshPromise;
    }

    private async handleRequest<T, B>(config: HttpRequestConfig<B>, isRetry: boolean): Promise<HttpResponse<T>> {
        if (this.refreshPromise && !config.skipRefresh && this.apiKey === undefined) {
            await this.refreshPromise;
        }

        const url = this.resolveUrl(config.path, config.slugs, config.params);
        const headers = this.resolveHeaders(config);
        const body = HttpSerializer.serializeBody(config.body);

        const response = await fetch(url, {
            method: config.method ?? 'GET',
            headers,
            body,
            credentials: config.credentials ?? 'include',
            signal: config.signal,
        });

        if (
            response.status === 401 &&
            !config.skipRefresh &&
            !isRetry &&
            this.apiKey === undefined &&
            this.getToken()
        ) {
            const newToken = await this.refreshToken();
            if (!newToken) {
                const data = (await HttpSerializer.deserializeBody(response)) as T;
                throw new HttpClientError(response.status, data);
            }
            return this.handleRequest<T, B>(config, true);
        }

        const data = (await HttpSerializer.deserializeBody(response)) as T;
        if (!response.ok) {
            throw new HttpClientError(response.status, data);
        }
        return { data, status: response.status, headers: response.headers, ok: response.ok };
    }

    private async handleRefreshToken(): Promise<string | undefined> {
        try {
            const refreshResponse = await fetch(URLResolver.resolve(this.baseUrl, DN_API_AUTH_USER_REFRESH), {
                method: 'POST',
                headers: { ...DN_DEFAULT_HEADERS },
                credentials: 'include',
            });
            if (!refreshResponse.ok) {
                throw new Error('refresh failed');
            }
            const json = (await refreshResponse.json()) as { value?: string };
            if (!json?.value) {
                throw new Error('missing token in refresh response');
            }
            this.setToken(json.value);
            return json.value;
        } catch {
            this.setToken(undefined);
            this.authErrorEvent.emit(undefined);
            return undefined;
        } finally {
            this.refreshPromise = null;
        }
    }

    private resolveUrl(
        path: string,
        slugs?: Record<string, string | number>,
        params?: Record<string, unknown>
    ): string {
        const resolved = URLResolver.resolveSlugs(path, slugs ?? {});
        const full = URLResolver.resolve(this.baseUrl, resolved);
        return params ? URLResolver.buildQuery(full, params) : full;
    }

    private resolveHeaders<B>(config: HttpRequestConfig<B>): Record<string, string> {
        const headers: Record<string, string> = { ...DN_DEFAULT_HEADERS, ...(config.headers ?? {}) };
        if (!config.skipAuth) {
            if (this.apiKey !== undefined) {
                headers[DN_API_KEY_HEADER] = this.apiKey;
            } else {
                const token = this.getToken();
                if (token) headers['Authorization'] = `Bearer ${token}`;
            }
        }
        if (config.body instanceof FormData || config.body instanceof Blob) {
            delete headers['Content-Type'];
        }
        return headers;
    }
}
