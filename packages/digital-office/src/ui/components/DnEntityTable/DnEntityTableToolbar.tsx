import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { CircularProgress, Popover, Stack, Typography } from '@mui/material';
import { Delete as DeleteIcon, AddCircle as AddIcon, FilterAlt as FilterAltIcon } from '@mui/icons-material';
import type { DnFilterDefinition } from './DnEntityTable';
import { DnEntityTableFilters } from './DnEntityTableFilters';
import { DnIconButton } from '../DnIconButton';

interface DnEntityTableToolbarProps {
    selectedCount: number;
    onDelete: () => void;
    onCreate?: () => void;
    loading?: boolean;
    filters?: DnFilterDefinition[];
    filterValues?: Record<string, string>;
    onFilterChange?: (patch: Record<string, string>) => void;
    onFilterReset?: () => void;
    activeFilterCount?: number;
}

export function DnEntityTableToolbar({
    selectedCount,
    onDelete,
    onCreate,
    loading,
    filters,
    filterValues,
    onFilterChange,
    onFilterReset,
    activeFilterCount = 0,
}: DnEntityTableToolbarProps) {
    const deleteDisabled = React.useMemo(() => loading || selectedCount < 1, [loading, selectedCount]);
    const filterDisabled = !filters?.length;
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const openFilters = Boolean(anchorEl);

    const handleOpenFilters = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleCloseFilters = () => setAnchorEl(null);

    return (
        <ToolbarRoot direction="row">
            <Typography
                variant="body2"
                sx={{ color: selectedCount > 0 ? 'text.primary' : 'text.disabled', fontSize: 'small' }}
            >
                {selectedCount} selected
            </Typography>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                {loading ? <CircularProgress size={18} /> : null}
                <DnIconButton
                    tooltip="Filtres"
                    disabled={filterDisabled}
                    counter={activeFilterCount}
                    onClick={handleOpenFilters}
                >
                    <FilterAltIcon />
                </DnIconButton>
                {onCreate ? (
                    <DnIconButton tooltip="Créer un nouvel élément" disabled={loading} onClick={onCreate}>
                        <AddIcon />
                    </DnIconButton>
                ) : null}
                <DnIconButton
                    tooltip={`Supprimer ${selectedCount} élément${selectedCount > 1 ? 's' : ''}`}
                    disabled={deleteDisabled}
                    onClick={onDelete}
                >
                    <DeleteIcon />
                </DnIconButton>
            </Stack>
            <Popover
                open={openFilters}
                anchorEl={anchorEl}
                onClose={handleCloseFilters}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.32))',
                            mt: 0.5,
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 11,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
            >
                {filters && onFilterChange && onFilterReset ? (
                    <DnEntityTableFilters
                        filters={filters}
                        values={filterValues ?? {}}
                        onChange={onFilterChange}
                        onReset={onFilterReset}
                    />
                ) : null}
            </Popover>
        </ToolbarRoot>
    );
}

const ToolbarRoot = styled(Stack)(
    ({ theme }) => css`
        flex: 1;
        min-width: 300px;
        padding: 0 1rem;
        border-radius: ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0;
        align-items: center;
        justify-content: space-between;
    `
);
