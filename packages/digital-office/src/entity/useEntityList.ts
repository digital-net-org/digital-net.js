import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { type Entity, type QueryResult, type EntityName, resolveEntityPath } from '@digital-net-org/digital-api-sdk';
import { type DnFilterDefinition, type DnPaginationState } from '../ui';
import { type UrlParam, UrlParamBuilder, useUrlQueryState } from '../navigation';
import { useDigitalNetApi, buildListKey } from '../api';

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
    sort: SortState;
    toggleSort: (_accessor: string) => void;
    filterValues: Record<string, string>;
    setFilterValues: (_patch: Record<string, string>) => void;
    resetFilters: () => void;
    activeFilterCount: number;
}

export function useEntityList<T extends Entity>(
    entityName: EntityName,
    filters?: DnFilterDefinition[]
): UseEntityListResult<T> {
    const apiPath = resolveEntityPath(entityName);
    if (!apiPath) {
        throw new Error('useEntityList: could not resolve entity list API path.');
    }

    const api = useDigitalNetApi();
    const [query, setQuery] = useUrlQueryState({
        page: UrlParamBuilder.buildInt(1, 'page'),
        row: UrlParamBuilder.buildInt(25, 'row'),
        orderBy: UrlParamBuilder.buildString('', 'order-by'),
        order: UrlParamBuilder.buildString('', 'order'),
    });

    const filterSchema = React.useMemo(() => {
        const s: Record<string, UrlParam<string>> = {};
        for (const f of filters ?? []) s[f.key] = UrlParamBuilder.buildString('', f.key);
        return s;
    }, [filters]);
    const [filterValues, setFilterValues] = useUrlQueryState(filterSchema);

    const urlPage = React.useMemo(() => Math.max(0, query.page - 1), [query.page]);
    const activeFilters = React.useMemo(() => {
        const out: Record<string, string> = {};
        for (const [k, v] of Object.entries(filterValues)) if (v !== '') out[k] = v;
        return out;
    }, [filterValues]);

    const { data: entitiesResult, isLoading } = useQuery<QueryResult<T>>({
        queryKey: [...buildListKey(entityName), urlPage, query.row, query.orderBy, query.order, activeFilters],
        queryFn: async () => {
            const result = await api.http.request<QueryResult<T>>({
                path: apiPath,
                params: {
                    index: urlPage + 1,
                    size: query.row,
                    ...(query.orderBy ? { 'order-by': query.orderBy, order: query.order || 'asc' } : {}),
                    ...activeFilters,
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

    const resetFilters = React.useCallback(() => {
        const cleared: Record<string, string> = {};
        for (const key in filterSchema) cleared[key] = '';
        setFilterValues(cleared);
    }, [filterSchema, setFilterValues]);

    const activeFilterCount = React.useMemo(() => Object.keys(activeFilters).length, [activeFilters]);

    return {
        entitiesResult,
        isLoading,
        pagination,
        setPagination,
        sort,
        toggleSort,
        filterValues,
        setFilterValues,
        resetFilters,
        activeFilterCount,
    };
}
