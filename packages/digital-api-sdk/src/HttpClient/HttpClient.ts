import { DigitalEvent, Env, URLResolver } from '@digital-net-org/digital-core';
import { DN_API_KEY_HEADER, DN_DEFAULT_HEADERS, DN_STORAGE_KEY } from './constants';
import { DN_API_AUTH_USER_REFRESH } from '../routes';
import { HttpClientError } from './HttpClientError';
import { HttpSerializer } from './HttpSerializer';
import type { HttpClientConfig, HttpRequestConfig, HttpResponse } from './types';
import type { Result } from '../types';

export class HttpClient {
    private readonly baseUrl: string;
    private readonly apiKey?: string;
    private readonly storageKey: string;
    private readonly apiKeyHeader: string;

    private readonly tokenChangeEvent: DigitalEvent<string | undefined> = new DigitalEvent();
    private readonly authErrorEvent: DigitalEvent<void> = new DigitalEvent();

    private refreshPromise: Promise<string | undefined> | null = null;
    private inMemoryToken: string | undefined;

    public constructor(config: HttpClientConfig) {
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.storageKey = (config.keyPrefix ?? '') + DN_STORAGE_KEY;
        this.apiKeyHeader = (config.keyPrefix ?? '') + DN_API_KEY_HEADER;
    }

    public async request<T = any, B = any>(config: HttpRequestConfig<B>): Promise<HttpResponse<T>> {
        return this.doRequest<T, B>(config, false);
    }

    public getToken(): string | undefined {
        return Env.hasUsableLocalStorage() ? (localStorage.getItem(this.storageKey) ?? undefined) : this.inMemoryToken;
    }

    public setToken(token: string | undefined): void {
        if (!Env.hasUsableLocalStorage()) {
            this.inMemoryToken = token;
        } else if (token) {
            localStorage.setItem(this.storageKey, token);
        } else {
            localStorage.removeItem(this.storageKey);
        }
        this.tokenChangeEvent.emit(token);
    }

    public clearToken(): void {
        this.setToken(undefined);
    }

    public subscribeTokenChangeEvent(listener: (_token: string | undefined) => void): () => void {
        return this.tokenChangeEvent.subscribe(listener);
    }

    public subscribeAuthErrorEvent(listener: () => void): () => void {
        return this.authErrorEvent.subscribe(listener);
    }

    public async refreshToken(): Promise<string | undefined> {
        this.refreshPromise ??= this.doRefreshToken();
        return this.refreshPromise;
    }

    private async doRequest<T = unknown, B = unknown>(
        config: HttpRequestConfig<B>,
        isRetry: boolean
    ): Promise<HttpResponse<T>> {
        if (this.refreshPromise && !config.skipRefresh && this.apiKey === undefined) {
            await this.refreshPromise;
        }

        const effectiveConfig = !config.skipHooks && config.onRequest ? await config.onRequest(config) : config;

        const url = this.resolveUrl(effectiveConfig.path, effectiveConfig.slugs, effectiveConfig.params);
        const headers = this.resolveHeaders(effectiveConfig);
        const body = HttpSerializer.serializeBody(effectiveConfig.body);

        const response = await fetch(url, {
            method: effectiveConfig.method ?? 'GET',
            headers,
            body,
            credentials: effectiveConfig.credentials ?? 'include',
            signal: effectiveConfig.signal,
        });

        const data = (await HttpSerializer.deserializeBody(response)) as T;
        const httpResponse: HttpResponse<T> = {
            data,
            status: response.status,
            headers: response.headers,
            ok: response.ok,
        };

        if (!effectiveConfig.skipHooks && effectiveConfig.onResponse) {
            await effectiveConfig.onResponse(httpResponse as HttpResponse<unknown>);
        }

        if (
            response.status === 401 &&
            !effectiveConfig.skipRefresh &&
            !isRetry &&
            this.apiKey === undefined &&
            this.getToken()
        ) {
            const newToken = await this.refreshToken();
            if (!newToken) {
                throw new HttpClientError(response.status, data);
            }
            return this.doRequest<T, B>(config, true);
        }

        if (!response.ok) {
            throw new HttpClientError(response.status, data);
        }
        return httpResponse;
    }

    private async doRefreshToken(): Promise<string | undefined> {
        try {
            const { data } = await this.doRequest<Result<string>>(
                {
                    method: 'POST',
                    path: DN_API_AUTH_USER_REFRESH,
                    skipAuth: true,
                    skipRefresh: true,
                    skipHooks: true,
                },
                true
            );
            if (!data?.value || data.hasError) {
                throw new Error('refresh failed');
            }
            this.setToken(data.value);
            return data.value;
        } catch {
            this.setToken(undefined);
            this.authErrorEvent.emit();
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
                headers[this.apiKeyHeader] = this.apiKey;
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
