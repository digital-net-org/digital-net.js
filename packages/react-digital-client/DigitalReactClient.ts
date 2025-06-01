import { type DigitalClientRequestConfig, type DigitalEndpoint, DigitalClient, ResultBuilder } from '@digital-net/core';
import { QueryClient } from '@tanstack/react-query';

export type DigitalImportConfig = Omit<DigitalClientRequestConfig, 'body' | 'method' | 'headers'>;

export class DigitalReactClient extends DigitalClient {
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

    public static async import<T>(
        endpoint: DigitalEndpoint,
        { onError, onSuccess, slugs, ...config }: DigitalImportConfig = {}
    ) {
        let result = {} as T;
        const contentType = 'application/javascript';

        const { data, status } = await this.axiosRequest({
            ...config,
            method: 'GET',
            url: this.resolveEndpoint(endpoint, slugs),
            headers: { 'Content-Type': contentType },
        });

        try {
            if (status >= 400 || !data || typeof data !== 'string') {
                throw new Error('Client error.');
            }

            const blob = new Blob([data], { type: contentType });
            const url = URL.createObjectURL(blob);
            result = /* @vite-ignore */ (await import(url)).default as T;
            URL.revokeObjectURL(url);
            await onSuccess?.(result);
        } catch (e) {
            console.error('DigitalClient: Import: Could not load Javascript file, only ESM is supported.', e);
            await onError?.({ ...ResultBuilder.buildError(data), status });
        }
        return result;
    }

    public static invalidate(...params: Array<string>) {
        (async () => await this.queryClient.invalidateQueries({ queryKey: params, refetchType: 'all' }))();
    }

    public static invalidateLike(...params: Array<string>) {
        (async () =>
            await this.queryClient.invalidateQueries({
                predicate: query => params.some(param => query.queryKey.some(key => String(key).includes(param))),
                refetchType: 'all',
            }))();
    }
}
