import * as React from 'react';
import { type QueryKey, useQuery } from '@tanstack/react-query';
import { type Entity, type QueryResult } from '@digital-net-org/digital-api-sdk';
import { type DnPaginationState } from '@digital-net-org/digital-ui';
import { urlInt, useUrlQueryState } from '../useUrlQueryState';
import { useDnApi } from '../../api';

export interface UseEntityListResult<T extends Entity> {
    entitiesResult: QueryResult<T> | undefined;
    isLoading: boolean;
    pagination: DnPaginationState;
    setPagination: (_next: DnPaginationState) => void;
    listQueryKey: QueryKey;
}

export function useEntityList<T extends Entity>(listPath: string): UseEntityListResult<T> {
    const api = useDnApi();
    const [query, setQuery] = useUrlQueryState({ page: urlInt(1), row: urlInt(25) });
    const urlPage = React.useMemo(() => Math.max(0, query.page - 1), [query.page]);
    const listQueryKey = React.useMemo<QueryKey>(() => ['dn-entity-list', listPath], [listPath]);

    const { data: entitiesResult, isLoading } = useQuery<QueryResult<T>>({
        queryKey: [...listQueryKey, urlPage, query.row],
        queryFn: async () => {
            const result = await api.http.request<QueryResult<T>>({
                path: listPath,
                params: { index: urlPage + 1, size: query.row },
            });
            return result.data;
        },
    });

    const pagination = React.useMemo<DnPaginationState>(
        () => ({
            page: urlPage,
            rowsPerPage: query.row,
            totalRows: entitiesResult?.total ?? 0,
        }),
        [urlPage, query.row, entitiesResult]
    );

    const setPagination = React.useCallback(
        (next: DnPaginationState) => setQuery({ page: next.page + 1, row: next.rowsPerPage }),
        [setQuery]
    );

    return { entitiesResult, isLoading, pagination, setPagination, listQueryKey };
}
