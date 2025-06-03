import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { DigitalReactClient } from './DigitalReactClient';

export const digitalClientInstance = new DigitalReactClient({
    axios: axios.create({
        withCredentials: true,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }),
    queryClient: new QueryClient({
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
    }),
});
