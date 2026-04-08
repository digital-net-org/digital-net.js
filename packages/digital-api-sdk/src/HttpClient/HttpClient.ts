import { DigitalEvent, URLResolver } from '@digital-net-org/digital-core';
import { DN_API_KEY_HEADER, DN_DEFAULT_HEADERS, DN_STORAGE_KEY } from './constants';
import { DN_API_AUTH_USER_REFRESH } from './routes';
import { HttpClientError } from './HttpClientError';
import type {
    AuthErrorListener,
    HttpClientConfig,
    HttpRequestConfig,
    HttpResponse,
    TokenChangeListener,
} from './types';

export class HttpClient {
    private readonly baseUrl: string;
    private readonly apiKey?: string;

    private readonly tokenChangeEvent: DigitalEvent<string | undefined> = new DigitalEvent();
    private readonly authErrorEvent: DigitalEvent<void> = new DigitalEvent();

    private refreshPromise: Promise<string | undefined> | null = null;

    public constructor(config: HttpClientConfig) {
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
    }

    public async request<T = any, B = any>(config: HttpRequestConfig<B>): Promise<HttpResponse<T>> {
        return this.performRequest<T, B>(config, false);
    }

    public getToken(): string | undefined {
        if (typeof localStorage === 'undefined') return undefined;
        return localStorage.getItem(DN_STORAGE_KEY) ?? undefined;
    }

    public setToken(token: string | undefined): void {
        if (typeof localStorage !== 'undefined') {
            if (token) localStorage.setItem(DN_STORAGE_KEY, token);
            else localStorage.removeItem(DN_STORAGE_KEY);
        }
        this.tokenChangeEvent.emit(token);
    }

    public clearToken(): void {
        this.setToken(undefined);
    }

    public onTokenChange(listener: TokenChangeListener): () => void {
        return this.tokenChangeEvent.subscribe(listener);
    }

    public onAuthError(listener: AuthErrorListener): () => void {
        return this.authErrorEvent.subscribe(listener);
    }

    private async performRequest<T, B>(
        config: HttpRequestConfig<B>,
        isRetry: boolean,
    ): Promise<HttpResponse<T>> {
        if (this.refreshPromise && !config.skipRefresh && this.apiKey === undefined) {
            await this.refreshPromise;
        }

        const url = this.buildUrl(config.path, config.slugs, config.params);
        const headers = this.buildHeaders(config);
        const body = this.serializeBody(config.body);

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
                const data = (await this.readBody(response)) as T;
                throw new HttpClientError(response.status, data);
            }
            return this.performRequest<T, B>(config, true);
        }

        const data = (await this.readBody(response)) as T;
        if (!response.ok) {
            throw new HttpClientError(response.status, data);
        }
        return { data, status: response.status, headers: response.headers, ok: response.ok };
    }

    private async refreshToken(): Promise<string | undefined> {
        if (!this.refreshPromise) {
            this.refreshPromise = (async (): Promise<string | undefined> => {
                try {
                    const refreshResponse = await fetch(
                        URLResolver.resolve(this.baseUrl, DN_API_AUTH_USER_REFRESH),
                        {
                            method: 'POST',
                            headers: { ...DN_DEFAULT_HEADERS },
                            credentials: 'include',
                        },
                    );
                    if (!refreshResponse.ok) throw new Error('refresh failed');
                    const json = (await refreshResponse.json()) as { value?: string };
                    if (!json?.value) throw new Error('missing token in refresh response');
                    this.setToken(json.value);
                    return json.value;
                } catch {
                    this.setToken(undefined);
                    this.authErrorEvent.emit(undefined);
                    return undefined;
                } finally {
                    this.refreshPromise = null;
                }
            })();
        }
        return this.refreshPromise;
    }

    private buildUrl(
        path: string,
        slugs?: Record<string, string | number>,
        params?: Record<string, unknown>,
    ): string {
        const resolved = URLResolver.resolveSlugs(path, slugs ?? {});
        const full = URLResolver.resolve(this.baseUrl, resolved);
        return params ? URLResolver.buildQuery(full, params) : full;
    }

    private buildHeaders<B>(config: HttpRequestConfig<B>): Record<string, string> {
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

    private serializeBody(body: unknown): BodyInit | undefined {
        if (body === undefined || body === null) return undefined;
        if (
            body instanceof FormData ||
            body instanceof Blob ||
            body instanceof ArrayBuffer ||
            body instanceof URLSearchParams ||
            typeof body === 'string'
        ) {
            return body as BodyInit;
        }
        return JSON.stringify(body);
    }

    private async readBody(response: Response): Promise<unknown> {
        const contentType = response.headers.get('content-type') ?? '';
        if (response.status === 204) return null;
        if (contentType.includes('application/json')) {
            try {
                return await response.json();
            } catch {
                return null;
            }
        }
        return response.text();
    }
}
