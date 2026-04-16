import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface DnEntityTableToolbarProps {
    selectedCount: number;
    onDelete: () => void;
    loading?: boolean;
}

export function DnEntityTableToolbar({ selectedCount, onDelete, loading }: DnEntityTableToolbarProps) {
    const disabled = React.useMemo(() => loading || selectedCount < 1, [loading, selectedCount]);
    return (
        <ToolbarRoot direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color={selectedCount > 0 ? 'textPrimary' : 'textDisabled'} fontSize="small">
                {selectedCount} selected
            </Typography>
            <Tooltip
                title={disabled ? '' : `Supprimer ${selectedCount} élément${selectedCount > 1 ? 's' : ''}`}
                placement="bottom-start"
            >
                <IconButton onClick={onDelete} disabled={disabled} color="inherit" size="small">
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </ToolbarRoot>
    );
}

const ToolbarRoot = styled(Stack)(
    ({ theme }) => css`
        flex: 1;
        min-width: 300px;
        padding: 0 1rem;
        border-radius: ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0;
    `
);
