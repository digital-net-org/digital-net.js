import * as React from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import type { QueryResult, SchemaProperty, UserDto } from '@digital-net-org/digital-api-sdk';
import { DnTableView, DnEntityTable, type DnPaginationState } from '@digital-net-org/digital-ui';
import { useDnApi } from '../api';
import { useDnToast } from '../app';

const USER_COLUMNS: (keyof UserDto)[] = ['username', 'email', 'isActive', 'isAdmin'];

export function UserListView() {
    const api = useDnApi();
    const navigate = useNavigate();
    const { showToast } = useDnToast();

    const [pagination, setPagination] = React.useState<DnPaginationState>({
        page: 0,
        rowsPerPage: 25,
        totalRows: 0,
    });

    const { data: schema } = useQuery<SchemaProperty[]>({
        queryKey: ['admin', 'user', 'schema'],
        queryFn: async () => {
            const result = await api.catalog.getSchema('user');
            return result.hasError ? [] : result.value;
        },
    });

    const { data: usersResult, isLoading } = useQuery<QueryResult<UserDto>>({
        queryKey: ['admin', 'user', 'list', pagination.page, pagination.rowsPerPage],
        queryFn: async () => {
            const result = await api.http.request<QueryResult<UserDto>>({
                path: 'admin/user',
                params: {
                    index: pagination.page + 1,
                    size: pagination.rowsPerPage,
                },
            });
            return result.data;
        },
    });

    React.useEffect(() => {
        if (usersResult) {
            setPagination(prev => ({ ...prev, totalRows: usersResult.total }));
        }
    }, [usersResult]);

    const handleDelete = React.useCallback(
        async (id: string) => {
            try {
                await api.http.request({ method: 'DELETE', path: `admin/user/${id}` });
            } catch {
                showToast('Failed to delete user', 'error');
            }
        },
        [api, showToast]
    );

    const handleRowClick = React.useCallback((row: UserDto) => navigate(`/admin/user/${row.id}`), [navigate]);

    return (
        <DnTableView>
            <DnEntityTable
                schema={schema ?? []}
                rows={usersResult?.value ?? []}
                columns={USER_COLUMNS}
                pagination={pagination}
                onPaginationChange={setPagination}
                onRowClick={handleRowClick}
                onDelete={handleDelete}
                loading={isLoading}
            />
        </DnTableView>
    );
}
