import * as React from 'react';
import { type QueryKey, useQuery } from '@tanstack/react-query';
import { type Entity, type QueryResult } from '@digital-net-org/digital-api-sdk';
import { type DnPaginationState } from '@digital-net-org/digital-ui';
import { urlInt, urlString, useUrlQueryState } from '../useUrlQueryState';
import { useDnApi } from '../../api';

export type SortDirection = 'asc' | 'desc' | '';

export interface SortState {
    orderBy: string;
    order: SortDirection;
}

export interface UseEntityListResult<T extends Entity> {
    entitiesResult: QueryResult<T> | undefined;
    isLoading: boolean;
    pagination: DnPaginationState;
    setPagination: (_next: DnPaginationState) => void;
    listQueryKey: QueryKey;
    sort: SortState;
    toggleSort: (_accessor: string) => void;
}

export function useEntityList<T extends Entity>(listPath: string): UseEntityListResult<T> {
    const api = useDnApi();
    const [query, setQuery] = useUrlQueryState({
        page: urlInt(1),
        row: urlInt(25),
        orderBy: urlString('', 'order-by'),
        order: urlString(),
    });
    const urlPage = React.useMemo(() => Math.max(0, query.page - 1), [query.page]);
    const listQueryKey = React.useMemo<QueryKey>(() => ['dn-entity-list', listPath], [listPath]);

    const { data: entitiesResult, isLoading } = useQuery<QueryResult<T>>({
        queryKey: [...listQueryKey, urlPage, query.row, query.orderBy, query.order],
        queryFn: async () => {
            const result = await api.http.request<QueryResult<T>>({
                path: listPath,
                params: {
                    index: urlPage + 1,
                    size: query.row,
                    ...(query.orderBy ? { 'order-by': query.orderBy, order: query.order || 'asc' } : {}),
                },
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

    const sort = React.useMemo<SortState>(
        () => ({ orderBy: query.orderBy, order: (query.order as SortDirection) || '' }),
        [query.orderBy, query.order]
    );

    const toggleSort = React.useCallback(
        (accessor: string) => {
            if (query.orderBy !== accessor) {
                setQuery({ orderBy: accessor, order: 'desc' });
            } else if (query.order === 'desc') {
                setQuery({ orderBy: accessor, order: 'asc' });
            } else {
                setQuery({ orderBy: '', order: '' });
            }
        },
        [query.orderBy, query.order, setQuery]
    );

    return { entitiesResult, isLoading, pagination, setPagination, listQueryKey, sort, toggleSort };
}
