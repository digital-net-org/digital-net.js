import type { SchemaProperty } from '@digital-net-org/digital-api-sdk';

export interface Entity {
    id: string;
}

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
    onRowClick: (row: T) => void;
    onDelete: (id: string) => Promise<void>;
    loading?: boolean;
    className?: string;
}
