import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { css, styled } from '@mui/material/styles';
import { DnDraggableContext } from '../DnDraggableContext';
import { DnButton } from '../DnButton';

export interface DnDraggableListProps<T extends { id: string }> {
    rows: T[];
    onSort: (_active: string, _over: string) => void;
    onCreate?: () => void;
    renderRow: (_row: T) => React.ReactNode;
    disabled?: boolean;
}

export function DnDraggableList<T extends { id: string }>({
    rows,
    onSort,
    renderRow,
    onCreate,
    disabled,
}: DnDraggableListProps<T>) {
    return (
        <DnDraggableContext rows={rows} onSort={onSort}>
            <List>
                {rows.length === 0 && !onCreate ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
                        Aucune donnée
                    </Typography>
                ) : (
                    rows.map(row => <React.Fragment key={row.id}>{renderRow(row)}</React.Fragment>)
                )}
                {onCreate ? (
                    <DnButton icon={<AddIcon fontSize="small" />} onClick={onCreate} disabled={disabled}>
                        Ajouter
                    </DnButton>
                ) : null}
            </List>
        </DnDraggableContext>
    );
}

const List = styled(Stack)(
    ({ theme }) => css`
        gap: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    `
);
