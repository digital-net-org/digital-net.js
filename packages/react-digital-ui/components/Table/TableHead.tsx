import type { Entity } from '@digital-net/core';
import { Text } from '../Text';
import { IconButton } from '../Button';
import { Box } from '../Box';
import { type TableProps, tableClassName } from './Table';

export interface TableHeadProps<T extends Entity> extends Omit<TableProps<T>, 'columns' | 'entities' | 'renderRow'> {
    columns: Array<keyof T>;
}

export function TableHead<T extends Entity>({ columns, renderHeader, onCreate, loading, disabled }: TableHeadProps<T>) {
    const className = `${tableClassName}-Header-Cell`;
    return (
        <thead>
            <tr className={`${tableClassName}-Header`}>
                {columns.map(s => (
                    <th key={String(s)} className={className}>
                        <Text variant="caption" size="small" bold>
                            {renderHeader?.(s) ?? String(s)}
                        </Text>
                    </th>
                ))}
                {onCreate !== undefined && (
                    <th className={className}>
                        <Box className={`${tableClassName}-Create`} fullWidth align="end">
                            <IconButton
                                icon="AddIcon"
                                onClick={onCreate}
                                variant="icon-filled"
                                disabled={disabled || loading}
                            />
                        </Box>
                    </th>
                )}
            </tr>
        </thead>
    );
}
