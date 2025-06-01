import type { DigitalClientRequestConfig } from '@digital-net/core';
import type { QueryConfig } from '../useDigitalQuery';

export type CrudConfig<T> = Omit<DigitalClientRequestConfig<T>, 'options' | 'method' | 'body'>;
export type CrudQueryConfig<T> = CrudConfig<T> & Omit<QueryConfig<any>, 'onSuccess' | 'onError'>;
