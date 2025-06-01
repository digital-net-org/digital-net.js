import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { axiosInstance } from './axiosInstance';

type AugmentedRequestConfig = InternalAxiosRequestConfig<any> & { _retry: boolean | undefined };

export abstract class DigitalClientHandlers {
    public static setRequestHandler(
        onRequest?: (request: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>,
        onError?: (error: any) => any
    ) {
        const handlerId = axiosInstance.interceptors.request.use(onRequest, error =>
            onError ? onError(error) : Promise.reject(error)
        );
        return () => axiosInstance.interceptors.request.eject(handlerId);
    }

    public static setResponseHandler(
        onResponse?: (response: AxiosResponse) => AxiosResponse,
        onError?: (
            error: any,
            response: AxiosResponse<unknown, any>,
            originalRequest: AugmentedRequestConfig
        ) => Promise<any>
    ) {
        const handlerId = axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => (onResponse ? onResponse(response) : response),
            (error: AxiosError) =>
                onError
                    ? onError(error, error.response!, error.config as AugmentedRequestConfig)
                    : Promise.reject(error)
        );
        return () => axiosInstance.interceptors.response.eject(handlerId);
    }
}
