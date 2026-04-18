import * as React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import { css, styled } from '@mui/material/styles';
import { type Entity } from '@digital-net-org/digital-api-sdk';
import {
    type DnColumnDefinition,
    type DnFilterDefinition,
    type DnRenderCell,
    DnDialogConfirmPassword,
    DnEntityTable,
} from '../../ui';
import { DnEntityDialogFailure } from './DnEntityDialogFailure';
import { type EntityIdentifier } from './identifier';
import { useEntityList } from './useEntityList';
import { useEntitySchema } from './useEntitySchema';
import { useEntityDelete } from './useEntityDelete';
import { DnView } from '../DnView';

const defaultRenderCell: DnRenderCell<Entity> = (col, value) => {
    if (col.schema.type === 'Boolean') return value ? 'Oui' : 'Non';
    return String(value ?? '');
};

export interface DnEntityListViewProps<T extends Entity> {
    title: string;
    description: string;
    identifier: EntityIdentifier;
    identifierAccessor: keyof T;
    schemaPath: string;
    listPath: string;
    deletePath: string;
    columns?: DnColumnDefinition<T>[];
    filters?: DnFilterDefinition[];
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
    filters,
    protectedDelete = false,
    onRowClick,
}: DnEntityListViewProps<T>) {
    const schema = useEntitySchema(schemaPath);
    const {
        entitiesResult,
        isLoading,
        pagination,
        setPagination,
        listQueryKey,
        sort,
        toggleSort,
        filterValues,
        setFilterValues,
        resetFilters,
        activeFilterCount,
    } = useEntityList<T>(listPath, filters);
    const { handleDelete, passwordDialog, failureDialog } = useEntityDelete<T>({
        deletePath,
        listQueryKey,
        entitiesResult,
        identifier,
        identifierAccessor,
        protectedDelete,
    });

    const handleRowClick = React.useCallback((row: T) => (onRowClick ? onRowClick(row) : void 0), [onRowClick]);

    return (
        <DnView title={title} description={description}>
            <DnEntityTable
                schema={schema}
                rows={entitiesResult?.value ?? []}
                columns={columns}
                renderCell={defaultRenderCell as DnRenderCell<T>}
                pagination={pagination}
                onPaginationChange={setPagination}
                onRowClick={handleRowClick}
                onDelete={handleDelete}
                loading={isLoading}
                sort={sort}
                onSortChange={toggleSort}
                filters={filters}
                filterValues={filterValues}
                onFilterChange={setFilterValues}
                onFilterReset={resetFilters}
                activeFilterCount={activeFilterCount}
            />
            {protectedDelete ? <DnDialogConfirmPassword {...passwordDialog} /> : null}
            <DnEntityDialogFailure
                open={Boolean(failureDialog.content)}
                content={failureDialog.content}
                identifier={identifier}
                onClose={failureDialog.close}
                onConfirm={failureDialog.close}
            />
        </DnView>
    );
}
