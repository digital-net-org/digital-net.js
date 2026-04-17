import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import {
    alpha,
    Checkbox,
    Paper,
    Stack,
    Table as MuiTable,
    TableBody as MuiTableBody,
    TableCell as MuiTableCell,
    TableContainer,
    TableHead as MuiTableHead,
    TablePagination as MuiTablePagination,
    TableRow as MuiTableRow,
    Typography,
} from '@mui/material';
import type { Entity, SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { DnEntityTableToolbar } from './DnEntityTableToolbar';
import { resolveColumns } from './resolveColumns';
import { DnDialog } from '../DnDialog';

export interface DnPaginationState {
    /** 0-based page index (MUI TablePagination convention). API `QueryResult.index` is 1-based. */
    page: number;
    rowsPerPage: number;
    totalRows: number;
}

export interface DnEntityTableProps<T extends Entity> {
    schema: SchemaProperty[];
    rows: T[];
    columns?: (keyof T)[];
    pagination: DnPaginationState;
    onPaginationChange: (pagination: DnPaginationState) => void;
    onRowClick: (row: T) => void | Promise<void>;
    onDelete: (id: Set<string>) => boolean | void | Promise<boolean | void>;
    loading?: boolean;
}

export function DnEntityTable<T extends Entity>({
    schema,
    rows,
    columns,
    pagination,
    onPaginationChange,
    onRowClick,
    onDelete,
    loading,
}: DnEntityTableProps<T>) {
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    const [deleting, setDeleting] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    React.useEffect(() => setSelectedIds(new Set()), [rows]);

    const allSelected = React.useMemo(
        () => rows.length > 0 && selectedIds.size === rows.length,
        [rows.length, selectedIds.size]
    );
    const someSelected = React.useMemo(
        () => selectedIds.size > 0 && selectedIds.size < rows.length,
        [rows.length, selectedIds.size]
    );
    const resolvedColumns = React.useMemo(() => resolveColumns<T>(schema, columns), [schema, columns]);
    const isLoading = React.useMemo(() => loading || deleting, [deleting, loading]);

    const handleSelectAll = () =>
        allSelected ? setSelectedIds(new Set()) : setSelectedIds(new Set(rows.map(r => r.id)));

    const handleSelectRow = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleDelete = async () => {
        setConfirmOpen(false);
        setDeleting(true);
        const result = await onDelete(selectedIds);
        setDeleting(false);
        if (typeof result === 'boolean' && !result) {
            return; // Delete is considered failed, keep selection intact
        }
        setSelectedIds(new Set());
    };

    const handlePageChange = (_: unknown, newPage: number) => onPaginationChange({ ...pagination, page: newPage });
    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onPaginationChange({
            ...pagination,
            rowsPerPage: parseInt(e.target.value, 10),
            page: 0,
        });
    };

    const colSpan = resolvedColumns.length + 1;

    return (
        <Root elevation={0}>
            <DnDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                confirmLabel="Supprimer"
            >
                <Typography>
                    Vous êtes sur le point de supprimer {selectedIds.size} element{selectedIds.size > 1 ? 's' : ''}.
                </Typography>
            </DnDialog>
            <ActionBar>
                <TablePagination
                    component="div"
                    size="small"
                    labelRowsPerPage={'Ligne par page'}
                    count={pagination.totalRows}
                    page={pagination.page}
                    rowsPerPage={pagination.rowsPerPage}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
                <DnEntityTableToolbar
                    selectedCount={selectedIds.size}
                    onDelete={() => setConfirmOpen(true)}
                    loading={deleting}
                />
            </ActionBar>
            <TableContainer>
                <Table $loading={isLoading}>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell padding="checkbox">
                                <Checkbox
                                    indeterminate={someSelected}
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                    disabled={isLoading}
                                />
                            </TableHeadCell>
                            {resolvedColumns.map(col => (
                                <TableHeadCell key={col.accessor}>{col.header}</TableHeadCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 && !isLoading ? (
                            <TableRow>
                                <TableBodyCell colSpan={colSpan} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        No data
                                    </Typography>
                                </TableBodyCell>
                            </TableRow>
                        ) : (
                            rows.map(row => {
                                const isSelected = selectedIds.has(row.id);
                                return (
                                    <TableRow key={row.id} hover selected={isSelected} onClick={() => onRowClick(row)}>
                                        <TableBodyCell padding="checkbox" onClick={e => e.stopPropagation()}>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(row.id)}
                                                disabled={isLoading}
                                                size="small"
                                            />
                                        </TableBodyCell>
                                        {resolvedColumns.map(col => (
                                            <TableBodyCell key={col.accessor}>
                                                {String((row as Record<string, unknown>)[col.accessor] ?? '')}
                                            </TableBodyCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Root>
    );
}

const Root = styled(Paper)(
    () => css`
        background-color: transparent;
        height: 100%;
        overflow-y: hidden;
        display: flex;
        flex-direction: column;
    `
);

const ActionBar = styled(Stack)(
    () => css`
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    `
);

const Table = styled(MuiTable, {
    shouldForwardProp: prop => prop !== '$loading',
})<{ $loading?: boolean }>(
    ({ $loading }) => css`
        ${$loading &&
        css`
            opacity: 0.5;
            pointer-events: none;
        `}
    `
);

const TableHead = styled(MuiTableHead)(
    ({ theme }) => css`
        background-color: ${alpha(theme.palette.divider, 0.5)};
    `
);

const TableHeadCell = styled(MuiTableCell)(
    ({ theme }) => css`
        font-weight: ${theme.typography.fontWeightMedium};
        text-transform: uppercase;
        letter-spacing: 0.035rem;
        padding: 0 0.25rem;
    `
);

const TableBody = styled(MuiTableBody)(
    () => css`
        height: 100%;
        width: 100%;
    `
);

const TableBodyCell = styled(MuiTableCell)(
    () => css`
        padding: 0 0.25rem;
        letter-spacing: 0.02rem;
        border: none;
    `
);

const TableRow = styled(MuiTableRow)(
    () => css`
        cursor: pointer;
    `
);

const TablePagination = styled(MuiTablePagination)<{ component: string }>(
    () => css`
        flex: 1;
        min-width: 410px;
        width: 410px;
        max-width: 410px;
        padding: 0 1rem;
        & .MuiToolbar-root {
            padding: 0;
        }
        & .MuiTablePagination-spacer {
            display: none;
        }
    `
);
