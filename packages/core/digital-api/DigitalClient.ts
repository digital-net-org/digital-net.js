import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { Slugs, Body, Headers, Patch, Params, Method, RequestCallbacks, DigitalEndpoint } from './types';
import { type Result } from '../dto';
import { ClientRequest, type DigitalHeader } from './ClientRequest';
import { ClientResponse } from './ClientResponse';

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
    private handlers: Array<() => void> = [];
    protected instance: AxiosInstance;
    protected token: string | undefined;
    protected refreshPromise: Promise<void> | null = null;

    public setToken(token?: string) {
        this.token = token;
    }

    public getToken() {
        return this.token;
    }

    constructor({ axios, initToken }: DigitalClientConstructor) {
        this.instance = axios;
        this.token = initToken;
    }

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

    public async retry(req: InternalAxiosRequestConfig) {
        req.headers.set('x-is-retrying' satisfies DigitalHeader, 'true');
        req.headers.set('Authorization', `Bearer ${this.token}`);
        return this.axiosRequest(req);
    }

    public dispose() {
        this.handlers.forEach(handler => handler());
        this.handlers = [];
    }

    protected axiosRequest: AxiosInstance['request'] = async config => await this.instance.request(config);

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

    mountInterceptors() {
        this.handlers.push(this.setRequestInterceptor());
        this.handlers.push(this.setResponseInterceptor());
    }

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
