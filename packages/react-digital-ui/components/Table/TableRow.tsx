import React from 'react';
import { type Entity } from '@digital-net/core';
import { Text } from '../Text';
import { Box } from '../Box';
import { IconButton } from '../Button';
import { type TableProps, tableClassName } from './Table';

interface TableRowProps<T extends Entity> extends Omit<TableProps<T>, 'entities' | 'columns'> {
    entity: T;
    columns: Array<keyof T>;
}

export function TableRow<T extends Entity>({
    entity,
    onEdit,
    onDelete,
    onCreate: _,
    renderRow,
    columns,
    ...props
}: TableRowProps<T>) {
    return (
        <tr key={entity.id} className={`${tableClassName}-Body-Row`}>
            {columns.map(s => (
                <td key={`${entity.id}_${String(s)}`} className={`${tableClassName}-Body-Cell`}>
                    <Text>{renderRow?.(s, entity) ?? String(entity[s])}</Text>
                </td>
            ))}
            <td className={`${tableClassName}-Body-Cell`}>
                <Box direction="row" justify="end" gap={1}>
                    {[
                        { cb: onEdit, icon: 'PencilSquare' as const },
                        { cb: onDelete, critical: true, icon: 'TrashIcon' as const },
                    ].map(({ cb, ...action }) =>
                        cb !== undefined ? (
                            <React.Fragment key={String(action.icon)}>
                                <IconButton
                                    onClick={() => cb(entity.id)}
                                    variant="icon-filled"
                                    {...action}
                                    {...props}
                                />
                            </React.Fragment>
                        ) : null
                    )}
                </Box>
            </td>
        </tr>
    );
}
