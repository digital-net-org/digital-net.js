import { QueryClient } from '@tanstack/react-query';
import axios, { type AxiosInstance, type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { type DigitalEndpoint, digitalEndpoints } from './digitalEndpoints';
import type { Result } from '@digital-lib/dto';
import { headersDictionary } from './headersDictionary';

type AugmentedRequestConfig = InternalAxiosRequestConfig<any> & { _retry: boolean | undefined };

export class DigitalClient {
    public static axiosInstance = axios.create({
        withCredentials: true,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    public static headersDictionary = headersDictionary;
    public static urls = digitalEndpoints;
    public static getUrl = (endpoint: DigitalEndpoint) => this.urls[endpoint];

    public static request: AxiosInstance['request'] = async config => await this.axiosInstance.request(config);
    public static get: AxiosInstance['get'] = async (url, config) => await this.axiosInstance.get(url, config);

    // TODO: Move from /digital-api
    public static queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                refetchOnReconnect: false,
                retry: 0,
                staleTime: 60000,
            },
            mutations: {
                retry: 0,
            },
        },
    });
    public static invalidate(url: string) {
        (async () => await this.queryClient.invalidateQueries({ queryKey: [url], refetchType: 'all' }))();
    }

    public static async refreshTokens() {
        return await DigitalClient.request<Result<string>>({
            method: 'POST',
            url: digitalEndpoints['authentication/user/refresh'],
            withCredentials: true,
        });
    }

    public static setRequestHandler(
        onRequest?: (request: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>,
        onError?: (error: any) => any
    ) {
        const handlerId = this.axiosInstance.interceptors.request.use(onRequest, error =>
            onError ? onError(error) : Promise.reject(error)
        );
        return () => this.axiosInstance.interceptors.request.eject(handlerId);
    }

    public static setResponseHandler(
        onResponse?: (response: AxiosResponse) => AxiosResponse,
        onError?: (
            error: any,
            response: AxiosResponse<unknown, any>,
            originalRequest: AugmentedRequestConfig
        ) => Promise<any>
    ) {
        const handlerId = this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => (onResponse ? onResponse(response) : response),
            (error: AxiosError) =>
                onError
                    ? onError(error, error.response!, error.config as AugmentedRequestConfig)
                    : Promise.reject(error)
        );
        return () => this.axiosInstance.interceptors.response.eject(handlerId);
    }
}
