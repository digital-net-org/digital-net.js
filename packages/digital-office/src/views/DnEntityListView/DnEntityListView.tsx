import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Divider, Stack, Typography } from '@mui/material';
import { css, styled } from '@mui/material/styles';
import { HttpClientError, type Entity, type QueryResult, type SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { DnDialog, DnDialogConfirmPassword, DnEntityTable, type DnPaginationState } from '@digital-net-org/digital-ui';
import { ArrayBuilder } from '@digital-net-org/digital-core';
import { useDnApi } from '../../api';
import { useDnToast } from '../../app';
import { urlInt, useUrlQueryState } from '../useUrlQueryState';
import { DnEntityFailureDialogContent } from './DnEntityFailureDialogContent';
import { type EntityIdentifier, resolveDeleteLabel } from './identifier';

const CHUNK_SIZE = 5;

interface DeleteTarget {
    id: string;
    name: string | undefined;
}

type DeleteResult = { success: true; target: DeleteTarget } | { success: false; target: DeleteTarget; error: unknown };

export interface DnEntityListViewProps<T extends Entity> {
    title: string;
    description?: string;
    identifier: EntityIdentifier;
    identifierAccessor: keyof T;
    schemaPath: string;
    listPath: string;
    deletePath: string;
    columns?: (keyof T)[];
    protectedDelete?: boolean;
    onRowClick?: (_row: T) => void;
}

export function DnEntityListView<T extends Entity>({
    title,
    description,
    identifier,
    identifierAccessor,
    schemaPath,
    listPath,
    deletePath,
    columns,
    protectedDelete = false,
    onRowClick,
}: DnEntityListViewProps<T>) {
    const api = useDnApi();
    const queryClient = useQueryClient();
    const { showToast } = useDnToast();

    const [query, setQuery] = useUrlQueryState({ page: urlInt(1), row: urlInt(25) });
    const urlPage = Math.max(0, query.page - 1);
    const urlRowsPerPage = query.row;

    const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [failureDialog, setFailureDialog] = React.useState<{
        failures: { name: string | undefined }[];
        total: number;
    } | null>(null);

    const pendingDeleteRef = React.useRef<{
        ids: Set<string>;
        resolve: (_success: boolean) => void;
    } | null>(null);

    const listQueryKey = React.useMemo(() => ['dn-entity-list', listPath] as const, [listPath]);
    const schemaQueryKey = React.useMemo(() => ['dn-entity-schema', schemaPath] as const, [schemaPath]);

    const { data: schema } = useQuery<SchemaProperty[]>({
        queryKey: [...schemaQueryKey],
        queryFn: async () => {
            const result = await api.catalog.getSchema(schemaPath);
            return result.hasError ? [] : result.value;
        },
    });

    const { data: entitiesResult, isLoading } = useQuery<QueryResult<T>>({
        queryKey: [...listQueryKey, urlPage, urlRowsPerPage],
        queryFn: async () => {
            const result = await api.http.request<QueryResult<T>>({
                path: listPath,
                params: { index: urlPage + 1, size: urlRowsPerPage },
            });
            return result.data;
        },
    });

    const pagination = React.useMemo<DnPaginationState>(
        () => ({
            page: urlPage,
            rowsPerPage: urlRowsPerPage,
            totalRows: entitiesResult?.total ?? 0,
        }),
        [urlPage, urlRowsPerPage, entitiesResult]
    );

    const setPagination = React.useCallback(
        (next: DnPaginationState) => setQuery({ page: next.page + 1, row: next.rowsPerPage }),
        [setQuery]
    );

    const buildTargets = React.useCallback(
        (ids: Set<string>): DeleteTarget[] => {
            const rows = entitiesResult?.value ?? [];
            return Array.from(ids).map(id => {
                const row = rows.find(r => r.id === id);
                const raw = row ? (row as Record<string, unknown>)[identifierAccessor as string] : undefined;
                return { id, name: raw != null ? String(raw) : undefined };
            });
        },
        [entitiesResult, identifierAccessor]
    );

    const deleteOne = React.useCallback(
        async (target: DeleteTarget, password?: string): Promise<DeleteResult> => {
            try {
                await api.http.request({
                    method: 'DELETE',
                    path: deletePath,
                    slugs: { id: target.id },
                    ...(password ? { body: { password } } : {}),
                });
                return { success: true, target };
            } catch (error) {
                return { success: false, target, error };
            }
        },
        [api, deletePath]
    );

    const showFeedback = React.useCallback(
        (failures: DeleteTarget[], total: number) => {
            const successCount = total - failures.length;
            if (failures.length === 0) {
                const plural = successCount > 1;
                const noun = plural ? identifier.plural : identifier.singular;
                showToast(`${successCount} ${noun} ${resolveDeleteLabel(identifier.gender, plural)}`, 'info');
            } else {
                setFailureDialog({ failures: failures.map(f => ({ name: f.name })), total });
            }
        },
        [identifier, showToast]
    );

    const executeBatchDelete = React.useCallback(
        async (ids: Set<string>, password?: string): Promise<boolean> => {
            setIsDeleting(true);
            setPasswordError(false);

            const targets = buildTargets(ids);
            const chunks = ArrayBuilder.chunk(targets, CHUNK_SIZE);
            const failures: DeleteTarget[] = [];
            let firstChunkDone = false;

            for (const chunk of chunks) {
                const results = await Promise.all(chunk.map(t => deleteOne(t, password)));

                if (protectedDelete && !firstChunkDone) {
                    const passwordWrong = results.some(
                        r => !r.success && r.error instanceof HttpClientError && r.error.status === 401
                    );
                    if (passwordWrong) {
                        setPasswordError(true);
                        setIsDeleting(false);
                        return false; // Wrong password, don't close the dialog
                    }
                    firstChunkDone = true;
                }

                for (const r of results) if (!r.success) failures.push(r.target);
            }

            await queryClient.invalidateQueries({ queryKey: listQueryKey });
            setPasswordDialogOpen(false);
            setIsDeleting(false);
            showFeedback(failures, targets.length);
            return true;
        },
        [buildTargets, deleteOne, listQueryKey, protectedDelete, queryClient, showFeedback]
    );

    const handleConfirmPassword = React.useCallback(
        async (password: string) => {
            const pending = pendingDeleteRef.current;
            if (!pending) return;
            const ok = await executeBatchDelete(pending.ids, password);
            if (!ok) return; // Wrong password, don't close the dialog
            pending.resolve(true);
            pendingDeleteRef.current = null;
        },
        [executeBatchDelete]
    );

    const handleDelete = React.useCallback(
        async (ids: Set<string>): Promise<boolean | void> => {
            if (!protectedDelete) {
                await executeBatchDelete(ids);
                return true;
            }
            return new Promise<boolean>(resolve => {
                pendingDeleteRef.current = { ids, resolve };
                setPasswordError(false);
                setPasswordDialogOpen(true);
            });
        },
        [executeBatchDelete, protectedDelete]
    );

    const handleClosePasswordDialog = React.useCallback(() => {
        if (pendingDeleteRef.current) {
            pendingDeleteRef.current.resolve(false);
            pendingDeleteRef.current = null;
        }
        setPasswordDialogOpen(false);
        setPasswordError(false);
    }, []);

    const handleCloseFailureDialog = React.useCallback(() => setFailureDialog(null), []);
    const handleRowClick = React.useCallback((row: T) => (onRowClick ? onRowClick(row) : void 0), [onRowClick]);

    return (
        <View>
            <Stack pb={2}>
                <Typography variant="h2">{title}</Typography>
                {description ? (
                    <Typography variant="body2" ml={0.35} mt={1}>
                        {description}
                    </Typography>
                ) : null}
            </Stack>
            <Divider />
            <DnEntityTable
                schema={schema ?? []}
                rows={entitiesResult?.value ?? []}
                columns={columns}
                pagination={pagination}
                onPaginationChange={setPagination}
                onRowClick={handleRowClick}
                onDelete={handleDelete}
                loading={isLoading}
            />
            {protectedDelete ? (
                <DnDialogConfirmPassword
                    open={passwordDialogOpen}
                    loading={isDeleting}
                    showError={passwordError}
                    onClose={handleClosePasswordDialog}
                    onConfirm={handleConfirmPassword}
                />
            ) : null}
            <DnDialog
                open={failureDialog !== null}
                confirmLabel="Fermer"
                showCancelAction={false}
                onClose={handleCloseFailureDialog}
                onConfirm={handleCloseFailureDialog}
            >
                {failureDialog ? (
                    <DnEntityFailureDialogContent failureDialog={failureDialog} identifier={identifier} />
                ) : null}
            </DnDialog>
        </View>
    );
}

const View = styled(Stack)(
    () => css`
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    `
);
