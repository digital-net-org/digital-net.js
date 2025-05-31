import type { AxiosRequestConfig } from 'axios';
import type { Result } from '@digital-net/core';

export type RequestConfig = Omit<AxiosRequestConfig, 'url' | 'baseURL' | 'method'>;

export type Method = 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'GET';

export interface RequestCallbacks<T> {
    onError?: (error: Result & { status: number }) => Promise<void> | void;
    onSuccess?: (data: T) => Promise<void> | void;
}

export interface QueryOptions {
    autoRefetch?: boolean;
    skipRefresh?: boolean;
    trigger?: boolean;
}

export interface QueryConfig<T> extends RequestConfig, QueryOptions, RequestCallbacks<T> {}

export interface MutationOptions {
    method?: Method;
    retry?: number;
    skipRefresh?: boolean;
}

export interface MutationConfig<T> extends RequestConfig, MutationOptions, RequestCallbacks<T> {}

export interface MutationPayload<T = object> {
    params?: T;
    body?: any;
    patch?: Array<PatchOperation>;
}

export interface PatchOperation {
    op: string;
    path: string;
    value: any;
}
