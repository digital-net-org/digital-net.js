import * as React from 'react';
import { type Entity } from '@digital-net-org/digital-api-sdk';
import {
    type DnColumnDefinition,
    type DnFilterDefinition,
    type DnRenderCell,
    DnDialogConfirmPassword,
    DnEntityTable,
    DnView,
} from '../../ui';
import { DnEntityDialogFailure } from './DnEntityDialogFailure';
import { type EntityIdentifier } from '../types';
import { type DnEntityName } from '../DnEntitySchemaProvider';
import { useEntityList } from '../useEntityList';
import { useEntitySchema } from '../useEntitySchema';
import { useEntityDelete } from '../useEntityDelete';
import { useEntityDraftIndex } from '../useEntityDraftIndex';

function defaultRenderCell<T extends Entity>(...args: Parameters<DnRenderCell<T>>): React.ReactNode {
    const [col, value] = args;
    if (col.kind === 'schema' && col.schema.type === 'Boolean') return value ? 'Oui' : 'Non';
    return String(value ?? '');
}

export interface DnEntityListViewProps<T extends Entity> {
    title: string;
    description: string;
    identifier: EntityIdentifier;
    identifierAccessor: keyof T;
    entityName: DnEntityName;
    listPath: string;
    deletePath: string;
    /**
     * Name of the draft store, used to highlight rows that have local unsaved
     * changes. Should match the key used by `useEntityDraft`, e.g. `"pages"`.
     * Omit to disable the draft indicator.
     */
    draftStoreName?: string;
    columns?: DnColumnDefinition<T>[];
    filters?: DnFilterDefinition[];
    protectedDelete?: boolean;
    onRowClick?: (_row: T) => void;
    onCreate?: () => void;
}

export function DnEntityListView<T extends Entity>({
    title,
    description,
    identifier,
    identifierAccessor,
    entityName,
    listPath,
    deletePath,
    draftStoreName,
    columns,
    filters,
    protectedDelete = false,
    onRowClick,
    onCreate,
}: DnEntityListViewProps<T>) {
    const { schemas, loading: isSchemaLoading } = useEntitySchema(entityName);
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

    const { drafts } = useEntityDraftIndex(draftStoreName ?? '');

    const getRowDraftInfo = React.useCallback(
        (row: T) => {
            if (!draftStoreName) return undefined;
            const ops = drafts.get(row.id);
            return ops ? { ops } : undefined;
        },
        [draftStoreName, drafts]
    );

    const handleRowClick = React.useCallback((row: T) => (onRowClick ? onRowClick(row) : void 0), [onRowClick]);

    return (
        <DnView title={title} description={description}>
            <DnEntityTable
                schema={schemas}
                rows={entitiesResult?.value ?? []}
                columns={columns}
                renderCell={defaultRenderCell}
                pagination={pagination}
                onPaginationChange={setPagination}
                onRowClick={handleRowClick}
                onCreate={onCreate}
                onDelete={handleDelete}
                loading={isLoading || isSchemaLoading}
                sort={sort}
                onSortChange={toggleSort}
                filters={filters}
                filterValues={filterValues}
                onFilterChange={setFilterValues}
                onFilterReset={resetFilters}
                activeFilterCount={activeFilterCount}
                getRowDraftInfo={draftStoreName ? getRowDraftInfo : undefined}
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
