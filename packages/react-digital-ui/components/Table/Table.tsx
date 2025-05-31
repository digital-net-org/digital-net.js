import React from 'react';
import type { Entity, Pagination } from '@digital-net/core';
import { Box } from '../Box';
import { Loader } from '../Loader';
import { Text } from '../Text';
import { TableHead } from './TableHead';
import { TableRow } from './TableRow';
import './Table.styles.css';

export interface TableProps<T extends Entity> {
    entities: T[];
    renderRow?: (key: keyof T, row: T) => React.ReactNode;
    renderHeader?: (key: keyof T) => React.ReactNode;
    renderEmpty?: () => React.ReactNode;
    columns?: Array<keyof T>;
    onCreate?: () => void;
    onEdit?: (id: T['id']) => void;
    onDelete?: (id: T['id']) => void;
    loading?: boolean;
    loadingActions?: boolean;
    disabled?: boolean;
    pagination?: Pagination;
}

export const tableClassName = 'DigitalUi-Table';

export function Table<T extends Entity>({
    loading,
    loadingActions,
    entities,
    columns,
    renderEmpty,
    renderHeader,
    renderRow,
    ...props
}: TableProps<T>) {
    const isEmpty = React.useMemo(
        () => !loading && !entities.length && renderEmpty,
        [entities.length, loading, renderEmpty]
    );

    return (
        <Box fullWidth fullHeight overflow="auto">
            <table className={tableClassName}>
                <TableHead columns={columns ?? []} loading={loading} renderHeader={renderHeader} {...props} />
                {!loading && !isEmpty && (
                    <tbody className={`${tableClassName}-Body`}>
                        {entities.map(entity => (
                            <React.Fragment key={entity.id}>
                                <TableRow
                                    entity={entity}
                                    columns={columns ?? []}
                                    disabled={props.disabled || loadingActions}
                                    renderRow={renderRow}
                                    {...props}
                                />
                            </React.Fragment>
                        ))}
                    </tbody>
                )}
            </table>
            {(isEmpty || loading) && (
                <Box className={`${tableClassName}-empty-content`} fullWidth align="center" justify="center">
                    {isEmpty && <Text>{renderEmpty?.()}</Text>}
                    {loading && <Loader size="medium" />}
                </Box>
            )}
        </Box>
    );
}
