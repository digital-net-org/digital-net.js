import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { RequestCallbacks } from './types';
import { ResultBuilder } from '../Dto';

export class ClientResponse {
    public static async handleResponse<T = any>(
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

    public static setResponseHandler(
        axiosInstance: AxiosInstance,
        onResponse?: (response: AxiosResponse) => AxiosResponse,
        onError?: (
            error: any,
            response: AxiosResponse<unknown, any>,
            originalRequest: InternalAxiosRequestConfig
        ) => Promise<any>
    ) {
        const handlerId = axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => (onResponse ? onResponse(response) : response),
            (error: AxiosError) =>
                onError
                    ? onError(error, error.response!, error.config as InternalAxiosRequestConfig)
                    : Promise.reject(error)
        );
        return () => axiosInstance.interceptors.response.eject(handlerId);
    }
}
