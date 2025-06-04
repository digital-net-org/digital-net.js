import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
    type Slugs,
    type Body,
    type Headers,
    type Patch,
    type Params,
    type Method,
    type RequestCallbacks,
    type DigitalEndpoint,
} from './types';
import { type Result } from '../dto';
import { ClientRequest, type DigitalHeader } from './ClientRequest';
import { ClientResponse } from './ClientResponse';
import { DigitalEvent } from '../modules';

export interface DigitalClientRequestConfig<T = any> extends RequestCallbacks<T> {
    method?: Method;
    slugs?: Slugs;
    params?: Params;
    headers?: Headers;
    body?: Patch<T> | Body;
    options?: {
        skipRefresh?: boolean;
        withCredentials?: boolean;
    };
}

export interface DigitalClientConstructor {
    axios: AxiosInstance;
    initToken?: string | undefined;
}

export class DigitalClient {
    private tokenChangeEvent = new DigitalEvent<string | undefined>();
    protected instance: AxiosInstance;

    constructor({ axios, initToken }: DigitalClientConstructor) {
        this.instance = axios;
        this.token = initToken;
    }

    /**
     * Performs a request to the Digital API.
     * @param endpoint - The endpoint to which the request is made.
     * @param options - The options for the request, including method, slugs, headers, body, and callbacks.
     * @template T - The type of the response data.
     * @example
     * ```ts
     * const response = await digitalClientInstance.request('/api/some-endpoint/:id', {
     *     method: 'POST',
     *     slugs: { id: '123' },
     *     headers: { 'Custom-Header': 'value' },
     *     body: { key: 'value' },
     *     onSuccess: (data) => console.log('Success:', data),
     *     onError: (error) => console.error('Error:', error),
     * });
     */
    public async request<T = any>(
        endpoint: DigitalEndpoint,
        { options, method, slugs, headers, body, ...callbacks }: DigitalClientRequestConfig<T> = {}
    ) {
        const result = await this.axiosRequest({
            url: ClientRequest.resolveEndpoint(endpoint, slugs),
            method: method ?? 'GET',
            data: body,
            headers: {
                ...(headers ?? {}),
                ...(options?.skipRefresh ? { ['x-skip-refresh' satisfies DigitalHeader]: 'true' } : {}),
            },
            withCredentials: options?.withCredentials,
        });
        return ClientResponse.handleResponse<T>(result, callbacks);
    }

    /**
     * Retries the request with the latest token. Sets the 'x-is-retrying' header to indicate that this is a retry.
     * @param req - The Axios request configuration to retry.
     * @example
     * ```ts
     * const retriedResponse = await digitalClientInstance.retry(originalRequest);
     * ```
     */
    public async retry(req: InternalAxiosRequestConfig) {
        req.headers.set('x-is-retrying' satisfies DigitalHeader, 'true');
        req.headers.set('Authorization', `Bearer ${this.token}`);
        return this.axiosRequest(req);
    }

    /**
     * Performs an Axios request using the instance. Without any predefined headers or configurations.
     * @param config - The Axios request configuration.
     * @template T - The type of the response data.
     * @template R - The type of the response.
     * @example
     * ```ts
     * const response = await digitalClientInstance.axiosRequest<Result<string>>({
     *     method: 'POST',
     *     url: '/api/some-endpoint',
     *     data: { key: 'value' },
     *     headers: { 'Content-Type': 'application/json' },
     * });
     * ```
     */
    protected axiosRequest: AxiosInstance['request'] = async config => await this.instance.request(config);

    /**
     * Sets the bearer token for the client.
     * @param token - The token to set for the client. If not provided, the token will be set to undefined.
     */
    public setToken(token?: string) {
        this.token = token;
        this.tokenChangeEvent.emit(token);
    }

    /**
     * Getter for the latest token.
     */
    public getToken() {
        return this.token;
    }

    /**
     * Subscribes to token changes.
     * @param cb - Callback function that will be called when the token changes.
     * The callback receives the new token as an argument, or undefined if the token was cleared.
     * @example
     * ```ts
     * digitalClientInstance.onTokenChange((newToken) => {
     *     console.log('Token changed:', newToken);
     * });
     * ```
     */
    public onTokenChange(cb: (token?: string) => void) {
        return this.tokenChangeEvent.subscribe(cb);
    }

    protected token: string | undefined;
    protected refreshPromise: Promise<void> | null = null;

    private async refreshTokens() {
        const endpoint: DigitalEndpoint = 'authentication/user/refresh';
        return await this.axiosRequest<Result<string>>({
            headers: {
                'Content-Type': 'application/json',
                ['x-skip-refresh' satisfies DigitalHeader]: 'true',
                ['x-is-refreshing' satisfies DigitalHeader]: 'true',
            },
            method: 'POST',
            url: ClientRequest.resolveEndpoint(endpoint),
            withCredentials: true,
        });
    }

    /**
     * Disposes all interceptors set on the instance.
     * Ensures that no memory leaks occur and that the instance does not retain unnecessary references.
     */
    public disposeInterceptors() {
        this.interceptors.forEach(handler => handler());
        this.interceptors = [];
    }

    /**
     * Mounts request and response interceptors on the instance.
     */
    public mountInterceptors() {
        this.interceptors.push(this.setRequestInterceptor());
        this.interceptors.push(this.setResponseInterceptor());
    }

    private interceptors: Array<() => void> = [];

    private setRequestInterceptor() {
        return ClientRequest.setRequestHandler(this.instance, async req => {
            if (this.refreshPromise && !ClientRequest.hasHeader(req, 'x-is-refreshing')) {
                await this.refreshPromise;
            }
            if (!ClientRequest.hasBearerToken(req)) {
                req.headers['Authorization'] = `Bearer ${this.token}`;
            }
            return req;
        });
    }

    private setResponseInterceptor() {
        return ClientResponse.setResponseHandler(
            this.instance,
            response => response,
            async (error, response, originalRequest) => {
                if (
                    response.status !== 401 ||
                    !ClientRequest.hasBearerToken(originalRequest) ||
                    ClientRequest.hasHeader(originalRequest, 'x-skip-refresh')
                ) {
                    return Promise.resolve(response);
                }

                if (
                    ClientRequest.hasHeader(originalRequest, 'x-is-retrying') ||
                    ClientRequest.hasHeader(originalRequest, 'x-is-refreshing')
                ) {
                    this.setToken(undefined);
                    return Promise.reject(error);
                }

                if (!this.refreshPromise) {
                    this.refreshPromise = (async () => {
                        try {
                            const { data } = await this.refreshTokens();
                            if (!data.value) throw new Error();
                            this.setToken(data.value);
                        } catch (e) {
                            this.setToken(undefined);
                            throw e;
                        } finally {
                            this.refreshPromise = null;
                        }
                    })();
                }

                await this.refreshPromise;
                return this.retry(originalRequest);
            }
        );
    }
}
