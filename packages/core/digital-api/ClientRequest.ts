import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { DigitalEndpoint, Slugs } from './types';
import { URI } from '../modules';

export type DigitalHeader = (typeof ClientRequest.headersDictionary)[keyof typeof ClientRequest.headersDictionary];
export type AxiosRequest = AxiosRequestConfig | InternalAxiosRequestConfig;

export class ClientRequest {
    public static headersDictionary = {
        Authorization: 'Authorization',
        contentType: 'Content-Type',
        skipRefresh: 'x-skip-refresh',
        isRefreshing: 'x-is-refreshing',
        isRetrying: 'x-is-retrying',
    } as const;

    public static resolveEndpoint = (endpoint: DigitalEndpoint, slugs?: Slugs) =>
        URI.resolve(DIGITAL_API_URL, URI.resolveSlugs(endpoint, slugs ?? {}));

    public static hasHeader = (request: AxiosRequest, header: DigitalHeader) =>
        request.headers && Object.prototype.hasOwnProperty.call(request.headers, header);

    public static hasBearerToken = (request: AxiosRequest) =>
        request.headers ? Object.prototype.hasOwnProperty.call(request.headers, 'Authorization') : false;

    public static setHeader = (request: InternalAxiosRequestConfig, header: DigitalHeader, value: string) =>
        request.headers.set(header, value);

    public static setRequestHandler(
        axiosInstance: AxiosInstance,
        onRequest?: (request: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>,
        onError?: (error: any) => any
    ) {
        const handlerId = axiosInstance.interceptors.request.use(onRequest, error =>
            onError ? onError(error) : Promise.reject(error)
        );
        return () => axiosInstance.interceptors.request.eject(handlerId);
    }
}
