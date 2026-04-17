import * as React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import { css, styled } from '@mui/material/styles';
import { type Entity } from '@digital-net-org/digital-api-sdk';
import { DnDialogConfirmPassword, DnEntityTable } from '@digital-net-org/digital-ui';
import { DnEntityDialogFailure } from './DnEntityDialogFailure';
import { type EntityIdentifier } from './identifier';
import { useEntityList } from './useEntityList';
import { useEntitySchema } from './useEntitySchema';
import { useEntityDelete } from './useEntityDelete';

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
    const schema = useEntitySchema(schemaPath);
    const { entitiesResult, isLoading, pagination, setPagination, listQueryKey } = useEntityList<T>(listPath);
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
                schema={schema}
                rows={entitiesResult?.value ?? []}
                columns={columns}
                pagination={pagination}
                onPaginationChange={setPagination}
                onRowClick={handleRowClick}
                onDelete={handleDelete}
                loading={isLoading}
            />
            {protectedDelete ? <DnDialogConfirmPassword {...passwordDialog} /> : null}
            <DnEntityDialogFailure
                open={Boolean(failureDialog.content)}
                content={failureDialog.content}
                identifier={identifier}
                onClose={failureDialog.close}
                onConfirm={failureDialog.close}
            />
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
