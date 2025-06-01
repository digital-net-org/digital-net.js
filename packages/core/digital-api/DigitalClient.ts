import { type AxiosResponse, type AxiosInstance } from 'axios';
import { URI } from '../modules';
import { type Result, ResultBuilder } from '../dto';
import { headersDictionary } from './headersDictionary';
import { axiosInstance } from './axiosInstance';
import { DigitalClientHandlers } from './DigitalClientHandlers';
import {
    type Params,
    type Body,
    type Headers,
    type Patch,
    type RequestParams,
    type Method,
    type RequestCallbacks,
    type DigitalEndpoint,
} from './types';

export interface DigitalClientRequestConfig<T = any> extends RequestCallbacks<T> {
    method?: Method;
    params?: Params;
    headers?: Headers;
    body?: Patch<T> | Body;
    options?: {
        skipRefresh?: boolean;
        withCredentials?: boolean;
    };
}

export class DigitalClient extends DigitalClientHandlers {
    private static resolveEndpoint = (endpoint: DigitalEndpoint, params?: RequestParams) =>
        URI.resolve(DIGITAL_API_URL, URI.applyParams(endpoint, params ?? {}));

    public static axiosRequest: AxiosInstance['request'] = async config => await axiosInstance.request(config);

    public static async request<T = any>(
        endpoint: DigitalEndpoint,
        { options, method, params, headers, body, ...callbacks }: DigitalClientRequestConfig<T> = {}
    ) {
        const result = await DigitalClient.axiosRequest({
            url: this.resolveEndpoint(endpoint, params),
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
