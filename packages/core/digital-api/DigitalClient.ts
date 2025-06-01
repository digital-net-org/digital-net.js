import { type AxiosResponse, type AxiosInstance } from 'axios';
import { URI } from '../modules';
import { type Result, ResultBuilder } from '../dto';
import { headersDictionary } from './headersDictionary';
import { axiosInstance } from './axiosInstance';
import { DigitalClientHandlers } from './DigitalClientHandlers';
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

export class DigitalClient extends DigitalClientHandlers {
    protected static resolveEndpoint = (endpoint: DigitalEndpoint, slugs?: Slugs) =>
        URI.resolve(DIGITAL_API_URL, URI.resolveSlugs(endpoint, slugs ?? {}));

    public static axiosRequest: AxiosInstance['request'] = async config => await axiosInstance.request(config);

    public static async request<T = any>(
        endpoint: DigitalEndpoint,
        { options, method, slugs, headers, body, ...callbacks }: DigitalClientRequestConfig<T> = {}
    ) {
        const result = await DigitalClient.axiosRequest({
            url: this.resolveEndpoint(endpoint, slugs),
            method: method ?? 'GET',
            data: body,
            headers: {
                ...(headers ?? {}),
                [headersDictionary.skipRefresh]: options?.skipRefresh ? 'true' : 'false',
            },
            withCredentials: options?.withCredentials,
        });
        return this.handleResponse<T>(result, callbacks);
    }

    private static async handleResponse<T = any>(
        { data, status }: AxiosResponse<T>,
        { onError, onSuccess }: RequestCallbacks<T> = {}
    ) {
        if (status >= 400) {
            await onError?.({ ...ResultBuilder.buildError(data), status });
        } else {
            await onSuccess?.(data);
        }
        return data;
    }

    public static async refreshTokens() {
        const url: DigitalEndpoint = 'authentication/user/refresh';
        return await DigitalClient.axiosRequest<Result<string>>({
            method: 'POST',
            url,
            withCredentials: true,
        });
    }
}
