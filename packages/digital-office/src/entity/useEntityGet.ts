import { useQuery } from '@tanstack/react-query';
import { HttpClientError } from '@digital-net-org/digital-api-sdk';
import { NotFoundException } from '../app/NotFoundException';
import { useDnApi } from '../api';

export interface UseEntityGetResult<T> {
    data: T | undefined;
    isLoading: boolean;
    isNew: boolean;
}

export function useEntityGet<T>(entityPath: string, id: string | undefined): UseEntityGetResult<T> {
    const api = useDnApi();
    const isNew = !id;

    const { data, isLoading, error } = useQuery<T>({
        queryKey: ['entity-get', entityPath, id],
        queryFn: async () => {
            const result = await api.http.request<T>({
                path: entityPath,
                slugs: { id: id! },
            });
            return result.data;
        },
        enabled: !isNew,
        retry: false,
    });

    if (error) {
        if (error instanceof HttpClientError && error.status === 404) {
            throw new NotFoundException(`Entité introuvable (${entityPath}, id=${id})`);
        }
        throw error;
    }

    return { data, isLoading: !isNew && isLoading, isNew };
}
