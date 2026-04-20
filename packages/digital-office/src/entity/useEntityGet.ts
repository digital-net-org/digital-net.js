import { useQuery } from '@tanstack/react-query';
import { HttpClientError, type Result } from '@digital-net-org/digital-api-sdk';
import { NotFoundException } from '../app/NotFoundException';
import { useDnApi } from '../api';

export interface UseEntityGetResult<T> {
    data: T | undefined;
    isLoading: boolean;
    isFetching: boolean;
    isNew: boolean;
}

function unwrapResult<T>(body: unknown): T | undefined {
    if (body && typeof body === 'object' && 'value' in body && 'hasError' in body) {
        return (body as Result<T>).value;
    }
    return body as T | undefined;
}

export function useEntityGet<T>(entityPath: string, id: string | undefined): UseEntityGetResult<T> {
    const api = useDnApi();
    const isNew = !id;

    const { data, isLoading, isFetching, error } = useQuery<T | undefined>({
        queryKey: ['entity-get', entityPath, id],
        queryFn: async () => {
            const response = await api.http.request<unknown>({
                path: entityPath,
                slugs: { id: id! },
            });
            return unwrapResult<T>(response.data);
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

    return { data, isLoading: !isNew && isLoading, isFetching: !isNew && isFetching, isNew };
}
