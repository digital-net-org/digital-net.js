import { DigitalClient } from '@digital-net/core';
import { QueryClient } from '@tanstack/react-query';

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
    public static invalidate(url: string) {
        (async () => await this.queryClient.invalidateQueries({ queryKey: [url], refetchType: 'all' }))();
    }
}
